import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderId = params.id;

    // Get the specific order for the current user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id, // Ensure user can only access their own orders
      },
      include: {
        orderitems: true,
        user: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      order: {
        ...order,
        itemsPrice: parseFloat(order.itemsPrice.toString()),
        shippingPrice: parseFloat(order.shippingPrice.toString()),
        taxPrice: parseFloat(order.taxPrice.toString()),
        totalPrice: parseFloat(order.totalPrice.toString()),
      }
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' }, 
      { status: 500 }
    );
  }
} 