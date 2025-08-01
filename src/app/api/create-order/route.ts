// app/api/create-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const { token } = await req.json(); // access_token

  try {
    const externalOrderId = `order_${Date.now()}`; // უნიკალური ID
    
    const response = await axios.post(
      'https://api.bog.ge/payments/v1/ecommerce/orders',
      {
        callback_url: 'https://www.kipianistore.ge/api/payment-callback',
        external_order_id: externalOrderId,

        purchase_units: {
          currency: 'GEL',
          total_amount: 10,
          basket: [
            {
              quantity: 1,
              unit_price: 10,
              product_id: 'product_1',
              name: 'ტესტ პროდუქტი', // optional, but recommended
            },
          ],
        },

        redirect_urls: {
          success: `https://www.kipianistore.ge/en/order-confirmation?status=success&orderId=${externalOrderId}`,
          fail: `https://www.kipianistore.ge/en/payment-fail?orderId=${externalOrderId}`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': 'ka', // ქართული ენისთვის 'ka'
          'Content-Type': 'application/json',
        },
      }
    );

    const { links } = response.data;

    const redirectUrl = links.find((link: any) => link.rel === 'approve')?.href;

    if (!redirectUrl) {
      throw new Error('Redirect URL not found in BOG response');
    }

    return NextResponse.json({ redirectUrl });
  } catch (error: any) {
    console.error('BOG order creation error:', error?.response?.data || error.message);
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}
