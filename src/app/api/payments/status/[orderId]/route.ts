import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    // Get BOG access token first
    const tokenRes = await fetch(`${req.nextUrl.origin}/api/token`);
    const tokenData = await tokenRes.json();
    
    if (!tokenRes.ok) {
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
    }

    const { access_token } = tokenData;
    const orderId = params.orderId;

    // Get payment status from BOG using original API
    const response = await axios.get(
      `https://api.bog.ge/payments/v1/ecommerce/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Accept-Language': 'ka',
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({
      success: true,
      paymentStatus: response.data,
    });
  } catch (error: any) {
    console.error('Payment status check error:', error?.response?.data || error.message);
    return NextResponse.json({ 
      error: 'Failed to check payment status',
      details: error?.response?.data || error.message
    }, { status: 500 });
  }
} 