// app/api/create-order/route.ts
// FIXED: Changed item.quantity to item.qty to match the actual cart item structure
// The cart items use 'qty' field, not 'quantity' field
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const { token, orderData } = await req.json();

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  if (!orderData) {
    return NextResponse.json({ error: 'Missing order data' }, { status: 400 });
  }

  try {
    const { cart, totalAmount, orderId } = orderData;
    
    // Calculate total amount from cart items
    const items = cart?.items || [];
    
    // Validate that cart has items
    if (items.length === 0) {
      throw new Error('Cart is empty');
    }
    
    // Validate and transform cart items for BOG API
    const basket = items.map((item: any) => {
      // Ensure quantity is a positive integer
      const quantity = parseInt(item.qty);
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error(`Invalid quantity for product ${item.productId}: ${item.qty}`);
      }
      
      // Ensure unit price is a valid number and convert to number (BOG expects number, not string)
      const unitPrice = parseFloat(item.price);
      if (isNaN(unitPrice) || unitPrice <= 0) {
        throw new Error(`Invalid price for product ${item.productId}: ${item.price}`);
      }
      
      // Ensure product ID exists and is a string
      const productId = item.productId || item.id;
      if (!productId || typeof productId !== 'string') {
        throw new Error(`Missing or invalid product ID for item: ${JSON.stringify(item)}`);
      }
      
      return {
        quantity: quantity, // BOG expects integer
        unit_price: unitPrice, // BOG expects number
        product_id: productId, // BOG expects string
      };
    });

    // Log the basket for debugging
    console.log('Cart items:', items);
    console.log('Basket for BOG:', basket);
    console.log('Total amount:', totalAmount);

    // Validate total amount
    const totalAmountNumber = parseFloat(totalAmount);
    if (isNaN(totalAmountNumber) || totalAmountNumber <= 0) {
      throw new Error(`Invalid total amount: ${totalAmount}`);
    }
    
    // Calculate total from basket to ensure consistency
    const calculatedTotal = basket.reduce((sum: number, item: { quantity: number; unit_price: number }) => sum + (item.quantity * item.unit_price), 0);
    console.log('Calculated total from basket:', calculatedTotal);
    console.log('Provided total amount:', totalAmountNumber);
    
    // Warn if totals don't match (but don't fail the request)
    if (Math.abs(calculatedTotal - totalAmountNumber) > 0.01) {
      console.warn(`Total amount mismatch: calculated=${calculatedTotal}, provided=${totalAmountNumber}`);
    }

    // Original BOG e-commerce API structure
    const response = await axios.post(
      'https://api.bog.ge/payments/v1/ecommerce/orders',
      {
        callback_url: 'https://www.kipianistore.ge/api/payment-callback',
        external_order_id: orderId,
        purchase_units: {
          currency: 'GEL',
          total_amount: totalAmountNumber,
          basket: basket,
        },
        redirect_urls: {
          success: `https://www.kipianistore.ge/en/order-confirmation?status=success&orderId=${orderId}`,
          fail: `https://www.kipianistore.ge/en/payment-fail?orderId=${orderId}`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': 'ka',
          'Content-Type': 'application/json',
        },
      }
    );

    const { links, order_id } = response.data;
    const redirectUrl = links.find((link: any) => link.rel === 'approve')?.href;

    if (!redirectUrl) {
      throw new Error('Redirect URL not found in BOG response');
    }

    return NextResponse.json({ 
      success: true,
      redirectUrl,
      orderId,
      bogOrderId: order_id
    });
  } catch (error: any) {
    console.error('BOG order creation error:', error?.response?.data || error.message);
    console.error('Full error object:', error);
    console.error('Error response data:', error?.response?.data);
    console.error('Error status:', error?.response?.status);
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}
