import { cookies } from "next/headers";
import { auth } from "../../../auth";
import { prisma } from "../prisma";
import { convertToPlainObject } from "../utils";
import { CartItem } from "../types";
import { Prisma } from "@prisma/client";

export async function getMyCart() {
  
    // Check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;

    
    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;
   
  
    // If no session cart ID and no user ID, return undefined (no cart)
    if (!sessionCartId && !userId) {
    
      return undefined;
    }
  
    // Get user cart from database
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    });
   
  
    if (!cart) return undefined;

    // Get cart items with location information
    const cartItems = cart.items as CartItem[];
    
    const itemsWithLocations = await Promise.all(
      cartItems.map(async (item) => {
        // Fetch product location information
        const product = await prisma.product.findFirst({
          where: { id: item.productId },
          select: { tbilisi: true, batumi: true, batumi44: true, qutaisi: true, kobuleti: true }
        });

        return {
          ...item,
          tbilisi: product?.tbilisi ?? false,
          batumi: product?.batumi ?? false,
          batumi44: product?.batumi44 ?? false,
          qutaisi: product?.qutaisi ?? false,
          kobuleti: product?.kobuleti ?? false,
        };
      })
    );
  
    // Convert decimals and return
    return convertToPlainObject({
      ...cart,
      items: itemsWithLocations,
      itemsPrice: cart.itemsPrice.toString(),
      totalPrice: cart.totalPrice.toString(),
      shippingPrice: cart.shippingPrice.toString(),
      taxPrice: cart.taxPrice.toString(),
    });
  }

export async function addToCart(productId: string, size: string, quantity: number = 1) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get product details
    const product = await prisma.product.findFirst({
      where: { id: productId },
      include: { sizes: true }
    });

    if (!product) throw new Error('Product not found');

    const productSize = product.sizes.find(s => s.size === size);
    if (!productSize) throw new Error('Product size not found');

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
      updatedItems[existingItemIndex].qty += quantity;
    } else {
      // Add new item
      const newItem: CartItem = {
        productId,
        name: product.title,
        size,
        qty: quantity,
        image: product.images[0],
        price: finalPrice.toFixed(2),
        tbilisi: product.tbilisi || false,
        batumi: product.batumi || false,
        batumi44: product.batumi44 || false,
        qutaisi: product.qutaisi || false,
        kobuleti: product.kobuleti || false,
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

    return convertToPlainObject({
      ...updatedCart,
      items: updatedItems,
      itemsPrice: updatedCart.itemsPrice.toString(),
      totalPrice: updatedCart.totalPrice.toString(),
      shippingPrice: updatedCart.shippingPrice.toString(),
      taxPrice: updatedCart.taxPrice.toString(),
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

export async function removeFromCart(productId: string, size: string) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    });

    if (!cart) throw new Error('Cart not found');

    const existingItems = cart.items as CartItem[];
    const filteredItems = existingItems.filter(
      item => !(item.productId === productId && item.size === size)
    );

    // Ensure remaining items have location information
    const updatedItems = await Promise.all(
      filteredItems.map(async (item) => {
        // Fetch product location information
        const product = await prisma.product.findFirst({
          where: { id: item.productId },
          select: { tbilisi: true, batumi: true, batumi44: true, qutaisi: true, kobuleti: true }
        });

        return {
          ...item,
          tbilisi: product?.tbilisi || false,
          batumi: product?.batumi || false,
          batumi44: product?.batumi44 || false,
          qutaisi: product?.qutaisi || false,
          kobuleti: product?.kobuleti || false,
        };
      })
    );

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

    return convertToPlainObject({
      ...updatedCart,
      items: updatedItems,
      itemsPrice: updatedCart.itemsPrice.toString(),
      totalPrice: updatedCart.totalPrice.toString(),
      shippingPrice: updatedCart.shippingPrice.toString(),
      taxPrice: updatedCart.taxPrice.toString(),
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

export async function updateCartItemQuantity(productId: string, size: string, quantity: number) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    });

    if (!cart) throw new Error('Cart not found');

    const existingItems = cart.items as CartItem[];
    const updatedItems = await Promise.all(
      existingItems.map(async (item) => {
        if (item.productId === productId && item.size === size) {
          // Fetch product location information for updated item
          const product = await prisma.product.findFirst({
            where: { id: item.productId },
            select: { tbilisi: true, batumi: true, batumi44: true, qutaisi: true, kobuleti: true }
          });

          return { 
            ...item, 
            qty: quantity,
            tbilisi: product?.tbilisi || false,
            batumi: product?.batumi || false,
            batumi44: product?.batumi44 || false,
            qutaisi: product?.qutaisi || false,
            kobuleti: product?.kobuleti || false,
          };
        }
        return item;
      })
    );

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

    return convertToPlainObject({
      ...updatedCart,
      items: updatedItems,
      itemsPrice: updatedCart.itemsPrice.toString(),
      totalPrice: updatedCart.totalPrice.toString(),
      shippingPrice: updatedCart.shippingPrice.toString(),
      taxPrice: updatedCart.taxPrice.toString(),
    });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
}

export async function clearCart() {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    });

    if (!cart) throw new Error('Cart not found');

    const updatedCart = await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: [],
        itemsPrice: new Prisma.Decimal(0),
        totalPrice: new Prisma.Decimal(0),
        shippingPrice: new Prisma.Decimal(0),
        taxPrice: new Prisma.Decimal(0),
      },
    });

    return convertToPlainObject({
      ...updatedCart,
      items: [],
      itemsPrice: updatedCart.itemsPrice.toString(),
      totalPrice: updatedCart.totalPrice.toString(),
      shippingPrice: updatedCart.shippingPrice.toString(),
      taxPrice: updatedCart.taxPrice.toString(),
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}

function calculateCartTotals(items: CartItem[]) {
  const itemsPrice = items.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.qty);
  }, 0);

  // Shipping calculation based on total items and price
  let shippingPrice = 0;
  if (itemsPrice > 0) {
    if (itemsPrice >= 500) {
      shippingPrice = 0; // Free shipping for orders over $500
    } else if (itemsPrice >= 200) {
      shippingPrice = 15; // $15 shipping for orders $200-$499
    } else {
      shippingPrice = 25; // $25 shipping for orders under $200
    }
  }

  // Tax calculation (18% VAT rate for Georgia)
  const taxPrice = itemsPrice * 0.18;

  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return {
    itemsPrice: parseFloat(itemsPrice.toFixed(2)),
    totalPrice: parseFloat(totalPrice.toFixed(2)),
    shippingPrice: parseFloat(shippingPrice.toFixed(2)),
    taxPrice: parseFloat(taxPrice.toFixed(2)),
  };
}
  