import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import { prisma } from "@/lib/prisma";
import axios from "axios";

// helper for mapping BOG status
function mapBogStatusToOrder(bogData: any) {
  // Check multiple possible status fields
  const status = bogData.order_status?.key || bogData.status?.key || bogData.payment_status?.key || bogData.payment_detail?.status?.key || bogData.purchase_units?.[0]?.status?.key;
  const statusValue = bogData.order_status?.value || bogData.status?.value || bogData.payment_status?.value || bogData.payment_detail?.status?.value || bogData.purchase_units?.[0]?.status?.value;
  
  console.log(`Mapping BOG status: ${status} (${statusValue})`);
  console.log(`Available status fields:`, {
    'order_status.key': bogData.order_status?.key,
    'order_status.value': bogData.order_status?.value,
    'status.key': bogData.status?.key,
    'status.value': bogData.status?.value,
    'payment_status.key': bogData.payment_status?.key,
    'payment_status.value': bogData.payment_status?.value,
    'payment_detail.status.key': bogData.payment_detail?.status?.key,
    'payment_detail.status.value': bogData.payment_detail?.status?.value,
    'purchase_units[0].status.key': bogData.purchase_units?.[0]?.status?.key,
    'purchase_units[0].status.value': bogData.purchase_units?.[0]?.status?.value
  });
  
  let isPaid = false;
  let isRefunded = false;
  let isFailed = false;

  // More comprehensive BOG status mapping
  switch (status) {
    case "completed":
    case "blocked":
    case "partial_completed":
    case "processing":
    case "paid":
    case "success":
    case "approved":
    case "confirmed":
    case "settled":
    case "captured":
    case "authorized":
    case "charged":
      isPaid = true;
      break;

    case "refunded":
    case "refunded_partially":
    case "refund":
      isPaid = true;
      isRefunded = true;
      break;

    case "rejected":
    case "failed":
    case "declined":
    case "cancelled":
      isFailed = true;
      break;

    case "created":
    case "auth_requested":
    case "pending":
    case "waiting":
    case "initiated":
      // These are pending statuses
      break;

    default:
      console.log(`Unknown BOG status: ${status}, treating as pending`);
      break;
  }

  // Additional check: if there's a successful payment amount, consider it paid
  if (!isPaid && !isFailed && !isRefunded) {
    const hasPaymentAmount = bogData.purchase_units?.transfer_amount || bogData.payment_detail?.amount || bogData.amount;
    const hasTransactionId = bogData.payment_detail?.transaction_id;
    
    if (hasPaymentAmount && hasTransactionId) {
    
      isPaid = true;
    }
  }
  

  
  return { isPaid, isRefunded, isFailed, status };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = params.orderId;

    // Get the order from database
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: session.user.id },
      include: { user: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only check BOG orders
    if (!order.paymentMethod?.includes("BOG")) {
      return NextResponse.json(
        {
          error: "Not a BOG order",
          orderStatus: order.isPaid ? "paid" : "pending",
        },
        { status: 400 }
      );
    }

    // Get BOG token
    const tokenRes = await fetch(`${request.nextUrl.origin}/api/token`);
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: "Failed to get BOG token" },
        { status: 500 }
      );
    }

    // Try to get BOG receipt using external_order_id (our order ID)
    try {
      // სტატუსის წამოღება
      const bogOrderResponse = await axios.get(
        `https://api.bog.ge/payments/v1/ecommerce/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "Accept-Language": "ka",
            "Content-Type": "application/json",
          },
        }
      );

      const bogOrderData = bogOrderResponse.data;


      const { isPaid, isRefunded, isFailed, status } =
        mapBogStatusToOrder(bogOrderData);

      // ჩეკის წამოღება სურვილისამებრ
      const bogReceiptResponse = await axios.get(
        `https://api.bog.ge/payments/v1/receipt/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "Accept-Language": "ka",
            "Content-Type": "application/json",
          },
        }
      );

      const bogReceiptData = bogReceiptResponse.data;


      const bogData = bogOrderResponse.data;
   

      // Update the order in database
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          isPaid,
          isDelivered: false,
          paidAt: isPaid ? new Date() : null,
          paymentResult: {
            status,
            transactionId: bogData.payment_detail?.transaction_id,
            amount: bogData.purchase_units?.transfer_amount,
            currency: bogData.purchase_units?.currency_code,
            method: bogData.payment_detail?.transfer_method?.key,
            cardType: bogData.payment_detail?.card_type,
            refunded: isRefunded,
            failed: isFailed,
            update_time: new Date().toISOString(),
          },
        },
      });

      return NextResponse.json({
        success: true,
        order: {
          ...updatedOrder,
          itemsPrice: parseFloat(updatedOrder.itemsPrice.toString()),
          shippingPrice: parseFloat(updatedOrder.shippingPrice.toString()),
          taxPrice: parseFloat(updatedOrder.taxPrice.toString()),
          totalPrice: parseFloat(updatedOrder.totalPrice.toString()),
        },
        bogStatus: {
          orderStatus: bogData.order_status?.key,
          orderStatusValue: bogData.order_status?.value,
          paymentMethod: bogData.payment_detail?.transfer_method?.key,
          transactionId: bogData.payment_detail?.transaction_id,
          amount: bogData.purchase_units?.transfer_amount,
          currency: bogData.purchase_units?.currency_code,
          buyerName: bogData.buyer?.full_name,
          buyerEmail: bogData.buyer?.email,
          buyerPhone: bogData.buyer?.phone_number,
        },
      });
    } catch (bogError: any) {
      // If BOG API fails, return current order status
      return NextResponse.json({
        success: true,
        order: {
          ...order,
          itemsPrice: parseFloat(order.itemsPrice.toString()),
          shippingPrice: parseFloat(order.shippingPrice.toString()),
          taxPrice: parseFloat(order.taxPrice.toString()),
          totalPrice: parseFloat(order.totalPrice.toString()),
        },
        bogStatus: null,
        error: "Failed to fetch BOG status",
        message: "Order status may not be up to date",
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch order status" },
      { status: 500 }
    );
  }
}
