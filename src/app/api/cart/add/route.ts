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

    if (!productId || !size) {
      return NextResponse.json(
        { error: 'Product ID and size are required' },
        { status: 400 }
      );
    }

    // Get or create session cart ID
    const cookieStore = await cookies();
    let sessionCartId = cookieStore.get('sessionCartId')?.value;
    
    if (!sessionCartId) {
      sessionCartId = crypto.randomUUID();
    }

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get product details
    const product = await prisma.product.findFirst({
      where: { id: productId },
      include: { sizes: true }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const productSize = product.sizes.find(s => s.size === size);
    if (!productSize) {
      return NextResponse.json(
        { error: 'Product size not found' },
        { status: 404 }
      );
    }

    // Calculate the price (discounted if there's a sale)
    const basePrice = parseFloat(productSize.price.toString());
    const finalPrice = product.sales && product.sales > 0 
      ? basePrice * (1 - product.sales / 100)
      : basePrice;

    // Get or create cart
    let cart = await prisma.cart.findFirst({
      where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          sessionCartId,
          userId,
          items: [],
          itemsPrice: new Prisma.Decimal(0),
          totalPrice: new Prisma.Decimal(0),
          shippingPrice: new Prisma.Decimal(0),
          taxPrice: new Prisma.Decimal(0),
        },
      });
    }

    // Check if item already exists in cart
    const existingItems = cart.items as CartItem[];
    const existingItemIndex = existingItems.findIndex(
      item => item.productId === productId && item.size === size
    );

    let updatedItems: CartItem[];
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      updatedItems = [...existingItems];
      updatedItems[existingItemIndex].qty += quantity || 1;
    } else {
      // Add new item
      const newItem: CartItem = {
        productId,
        name: product.title,
        size,
        qty: quantity || 1,
        image: product.images[0],
        price: finalPrice.toFixed(2),
      };
      updatedItems = [...existingItems, newItem];
    }

    // Calculate totals
    const { itemsPrice, totalPrice, shippingPrice, taxPrice } = calculateCartTotals(updatedItems);

    // Update cart
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

    // Create response with cookie if needed
    const response = NextResponse.json({
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

    // Set cookie if it didn't exist
    if (!cookieStore.get('sessionCartId')) {
      response.cookies.set('sessionCartId', sessionCartId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return response;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
} 