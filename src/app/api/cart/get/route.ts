import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '../../../../../auth';
import { prisma } from '@/lib/prisma';
import { CartItem } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    // Get session cart ID
    const cookieStore = await cookies();
    const sessionCartId = cookieStore.get('sessionCartId')?.value;
    
    if (!sessionCartId) {
      return NextResponse.json({ cart: null });
    }

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    });

    if (!cart) {
      return NextResponse.json({ cart: null });
    }

    return NextResponse.json({
      cart: {
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
      }
    });
  } catch (error) {
    console.error('Error getting cart:', error);
    return NextResponse.json(
      { error: 'Failed to get cart' },
      { status: 500 }
    );
  }
} 