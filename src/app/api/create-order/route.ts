// app/api/create-order/route.ts
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
    const basket = items.map((item: any) => ({
      quantity: item.quantity,
      unit_price: parseFloat(item.price),
      product_id: item.productId || item.id,
    }));

    // Original BOG e-commerce API structure
    const response = await axios.post(
      'https://api.bog.ge/payments/v1/ecommerce/orders',
      {
        callback_url: 'https://www.kipianistore.ge/api/payment-callback',
        external_order_id: orderId,
        purchase_units: {
          currency: 'GEL',
          total_amount: totalAmount,
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
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}
