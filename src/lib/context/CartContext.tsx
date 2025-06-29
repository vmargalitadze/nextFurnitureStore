'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '@/lib/types';

interface Cart {
  id: string;
  items: CartItem[];
  itemsPrice: string;
  totalPrice: string;
  shippingPrice: string;
  taxPrice: string;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  cartItemCount: number;
  updateCart: (newCart: Cart | null) => void;
  refreshCart: () => Promise<void>;
  addToCartOptimistic: (item: CartItem) => void;
  removeFromCartOptimistic: (productId: string, size: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const response = await fetch('/api/cart/get');
      if (!response.ok) {
        throw new Error('Failed to load cart');
      }
      
      const { cart: cartData } = await response.json();
      if (cartData) {
        setCart({
          id: cartData.id,
          items: cartData.items,
          itemsPrice: cartData.itemsPrice,
          totalPrice: cartData.totalPrice,
          shippingPrice: cartData.shippingPrice,
          taxPrice: cartData.taxPrice,
        });
      } else {
        setCart(null);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const updateCart = (newCart: Cart | null) => {
    setCart(newCart);
  };

  const refreshCart = async () => {
    await loadCart();
  };

  const addToCartOptimistic = (item: CartItem) => {
    if (!cart) {
      // If no cart exists, create a new one with the item
      const newCart: Cart = {
        id: 'temp',
        items: [item],
        itemsPrice: item.price,
        totalPrice: item.price,
        shippingPrice: '0',
        taxPrice: '0',
      };
      setCart(newCart);
    } else {
      // Check if item already exists
      const existingItemIndex = cart.items.findIndex(
        existingItem => existingItem.productId === item.productId && existingItem.size === item.size
      );

      let updatedItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = [...cart.items];
        updatedItems[existingItemIndex].qty += item.qty;
      } else {
        // Add new item
        updatedItems = [...cart.items, item];
      }

      // Calculate new totals (simplified calculation)
      const itemsPrice = updatedItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.qty), 0);
      const taxPrice = itemsPrice * 0.18; // 18% tax
      const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over 100
      const totalPrice = itemsPrice + taxPrice + shippingPrice;

      setCart({
        ...cart,
        items: updatedItems,
        itemsPrice: itemsPrice.toString(),
        totalPrice: totalPrice.toString(),
        shippingPrice: shippingPrice.toString(),
        taxPrice: taxPrice.toString(),
      });
    }
  };

  const removeFromCartOptimistic = (productId: string, size: string) => {
    if (!cart) return;

    const updatedItems = cart.items.filter(
      item => !(item.productId === productId && item.size === size)
    );

    if (updatedItems.length === 0) {
      setCart(null);
      return;
    }

    // Calculate new totals
    const itemsPrice = updatedItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.qty), 0);
    const taxPrice = itemsPrice * 0.18;
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    setCart({
      ...cart,
      items: updatedItems,
      itemsPrice: itemsPrice.toString(),
      totalPrice: totalPrice.toString(),
      shippingPrice: shippingPrice.toString(),
      taxPrice: taxPrice.toString(),
    });
  };

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.qty, 0) || 0;

  useEffect(() => {
    loadCart();
  }, []);

  const value: CartContextType = {
    cart,
    loading,
    cartItemCount,
    updateCart,
    refreshCart,
    addToCartOptimistic,
    removeFromCartOptimistic,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 