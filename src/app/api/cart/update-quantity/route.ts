import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '../../../../../auth';
import { prisma } from '@/lib/prisma';
import { CartItem } from '@/lib/types';
import { Prisma } from '@prisma/client';

function calculateCartTotals(items: CartItem[]) {
  const itemsPrice = items.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.qty);
  }, 0);

  // Shipping calculation based on total items and price (in Lari)
  let shippingPrice = 0;
  if (itemsPrice > 0) {
    if (itemsPrice >= 1500) {
      shippingPrice = 0; // Free shipping for orders over ₾1500
    } else if (itemsPrice >= 600) {
      shippingPrice = 25; // ₾25 shipping for orders ₾600-₾1499
    } else {
      shippingPrice = 40; // ₾40 shipping for orders under ₾600
    }
  }

  // Tax calculation (assuming 18% VAT rate for Georgia)
  const taxPrice = itemsPrice * 0.18;

  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return {
    itemsPrice: parseFloat(itemsPrice.toFixed(2)),
    totalPrice: parseFloat(totalPrice.toFixed(2)),
    shippingPrice: parseFloat(shippingPrice.toFixed(2)),
    taxPrice: parseFloat(taxPrice.toFixed(2)),
  };
}

export async function POST(request: NextRequest) {
  try {
    const { productId, size, quantity } = await request.json();

    if (!productId || !size || quantity === undefined) {
      return NextResponse.json(
        { error: 'Product ID, size, and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    // Get session cart ID
    const cookieStore = await cookies();
    const sessionCartId = cookieStore.get('sessionCartId')?.value;
    
    if (!sessionCartId) {
      return NextResponse.json(
        { error: 'Cart session not found' },
        { status: 404 }
      );
    }

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const existingItems = cart.items as CartItem[];
    const updatedItems = existingItems.map(item => {
      if (item.productId === productId && item.size === size) {
        return { ...item, qty: quantity };
      }
      return item;
    });

    const { itemsPrice, totalPrice, shippingPrice, taxPrice } = calculateCartTotals(updatedItems);

    const updatedCart = await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: updatedItems,
        itemsPrice: new Prisma.Decimal(itemsPrice),
        totalPrice: new Prisma.Decimal(totalPrice),
        shippingPrice: new Prisma.Decimal(shippingPrice),
        taxPrice: new Prisma.Decimal(taxPrice),
      },
    });

    return NextResponse.json({
      success: true,
      cart: {
        ...updatedCart,
        items: updatedItems,
        itemsPrice: updatedCart.itemsPrice.toString(),
        totalPrice: updatedCart.totalPrice.toString(),
        shippingPrice: updatedCart.shippingPrice.toString(),
        taxPrice: updatedCart.taxPrice.toString(),
      }
    });
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return NextResponse.json(
      { error: 'Failed to update cart quantity' },
      { status: 500 }
    );
  }
} 