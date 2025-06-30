import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { prisma } from '@/lib/prisma';
import { sendOrderReceipt } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      shippingAddress, 
      paymentMethod, 
      deliveryOption,
      cartId 
    } = body;

    // Get the user's cart
    const cart = await prisma.cart.findFirst({
      where: {
        OR: [
          { userId: session.user.id },
          { sessionCartId: session.user.id }
        ]
      }
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate delivery price based on option and cart total
    const itemsPrice = parseFloat(cart.itemsPrice.toString());
    let shippingPrice = 0;
    
    // Base shipping calculation
    if (itemsPrice >= 500) {
      shippingPrice = 0; // Free shipping for orders over ₾500
    } else if (itemsPrice >= 200) {
      shippingPrice = 15; // ₾15 shipping for orders ₾200-₾499
    } else {
      shippingPrice = 25; // ₾25 shipping for orders under ₾200
    }
    
    // Add delivery option surcharge
    switch (deliveryOption) {
      case 'express':
        shippingPrice += 15;
        break;
      case 'same-day':
        shippingPrice += 25;
        break;
      default:
        // Standard delivery - no additional charge
        break;
    }

    // Create order items from cart items
    const orderItems = cart.items.map((item: any) => ({
      productId: item.productId,
      qty: item.qty,
      price: parseFloat(item.price),
      title: item.name,
      image: item.image
    }));

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: parseFloat(cart.itemsPrice.toString()) + parseFloat(cart.taxPrice.toString()) + shippingPrice,
        orderitems: {
          create: orderItems
        }
      },
      include: {
        orderitems: true,
        user: true
      }
    });

    // Send order receipt email
    try {
      const customerName = `${shippingAddress.firstName} ${shippingAddress.lastName}`;
      await sendOrderReceipt(shippingAddress.email, order, customerName);
    } catch (emailError) {
      console.error('Error sending order receipt email:', emailError);
      // Don't fail the order if email fails
    }

    // Clear the cart after successful order creation
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: [],
        itemsPrice: 0,
        totalPrice: 0,
        shippingPrice: 0,
        taxPrice: 0
      }
    });

    return NextResponse.json({ 
      success: true, 
      order: order,
      message: 'Order created successfully and cart cleared'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' }, 
      { status: 500 }
    );
  }
} 