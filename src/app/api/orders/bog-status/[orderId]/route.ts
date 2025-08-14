import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../../auth';
import { prisma } from '@/lib/prisma';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderId = params.orderId;

    // Get the order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id
      },
      include: {
        user: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }



    // Only check BOG orders
    if (!order.paymentMethod?.includes('BOG')) {
      return NextResponse.json({ 
        error: 'Not a BOG order',
        orderStatus: order.isPaid ? 'paid' : 'pending'
      }, { status: 400 });
    }

    // Get BOG token
    const tokenRes = await fetch(`${request.nextUrl.origin}/api/token`);
    const tokenData = await tokenRes.json();
    
    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'Failed to get BOG token' }, { status: 500 });
    }

    // Try to get BOG receipt using external_order_id (our order ID)
    try {
      const bogResponse = await axios.get(
        `https://api.bog.ge/payments/v1/receipt/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            'Accept-Language': 'ka',
            'Content-Type': 'application/json'
          }
        }
      );



      const bogData = bogResponse.data;
      
      // Update order status based on BOG response
      let isPaid = false;
      let isDelivered = false;
      let paidAt = null;
      let paymentResult = null;

      if (bogData.order_status?.key === 'completed') {
        isPaid = true;
        paidAt = new Date();
        isDelivered = false; // Still needs to be delivered
        paymentResult = {
          id: bogData.payment_detail?.transaction_id,
          status: 'succeeded',
          update_time: new Date().toISOString(),
          email_address: bogData.buyer?.email,
          payer_id: bogData.payment_detail?.payer_identifier,
          payment_method: bogData.payment_detail?.transfer_method?.key || 'card',
          card_type: bogData.payment_detail?.card_type,
          card_expiry: bogData.payment_detail?.card_expiry_date
        };
      } else if (bogData.order_status?.key === 'rejected') {
        isPaid = false;
        isDelivered = false;
        paymentResult = {
          status: 'failed',
          reason: bogData.reject_reason || 'unknown',
          update_time: new Date().toISOString()
        };
      } else if (bogData.order_status?.key === 'processing') {
        isPaid = false;
        isDelivered = false;
        paymentResult = {
          status: 'processing',
          update_time: new Date().toISOString()
        };
      }

      // Update the order in database
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          isPaid,
          isDelivered,
          paidAt,
          ...(paymentResult && { paymentResult })
        }
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
          buyerPhone: bogData.buyer?.phone_number
        }
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
        error: 'Failed to fetch BOG status',
        message: 'Order status may not be up to date'
      });
    }

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch order status' }, 
      { status: 500 }
    );
  }
}
