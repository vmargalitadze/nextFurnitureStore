import { NextRequest, NextResponse } from 'next/server';
import { getMyCart } from '@/lib/actions/cart.actions';

export async function GET(request: NextRequest) {
  try {
    console.log('Cart GET API called');
    const cart = await getMyCart();
    console.log('Cart data from getMyCart:', cart);
    
    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error getting cart:', error);
    // Return empty cart instead of error for better UX
    return NextResponse.json({ cart: null });
  }
} 