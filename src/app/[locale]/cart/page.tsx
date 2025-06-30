'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, ShoppingBag, Truck, CreditCard } from 'lucide-react';
import { Link } from '@/i18n/navigation'; 
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useCart } from '@/lib/context/CartContext';
import Image from 'next/image';

const CartPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const { cart, loading, refreshCart, removeFromCartOptimistic } = useCart();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleQuantityChange = async (productId: string, size: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(`${productId}-${size}`);
    try {
      const response = await fetch('/api/cart/update-quantity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, size, quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      await refreshCart();
      toast.success('Cart updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (productId: string, size: string) => {
    setUpdating(`${productId}-${size}`);
    
    // Optimistically remove from UI
    removeFromCartOptimistic(productId, size);
    
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, size }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      await refreshCart();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
      // Refresh cart to revert optimistic update on error
      await refreshCart();
    } finally {
      setUpdating(null);
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      await refreshCart();
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    router.push(`/${params.locale}/checkout`);
  };

  const formatPrice = (price: string) => {
    return `₾${parseFloat(price).toFixed(2)}`;
  };

  const formatSize = (size: string) => {
    return size.replace('SIZE_', '').replace('_', 'x');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mt-[120px] min-h-screen mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('cart.empty')}
            </h1>
            <p className="text-gray-600 mb-8">
              {t('cart.emptyDescription')}
            </p>
            <Link href="/list">
              <Button  variant="outline"    className="w-[30%] px-4  mb-10  py-2 text-[18px] font-medium text-white bg-[#438c71] rounded-lg hover:bg-[#3a7a5f] transition-colors ">
                {t('cart.continueShopping')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mt-[100px] justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('cart.title')}
          </h1>
        
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {t('cart.items')} ({cart.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                        width={80}
                        height={80}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Size: {formatSize(item.size)}
                      </p>
                      <p className="text-lg font-bold text-[#438c71]">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.size, item.qty - 1)}
                        disabled={updating === `${item.productId}-${item.size}`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold">
                        {updating === `${item.productId}-${item.size}` ? '...' : item.qty}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.size, item.qty + 1)}
                        disabled={updating === `${item.productId}-${item.size}`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#438c71]">
                        {formatPrice((parseFloat(item.price) * item.qty).toString())}
                      </p>
                    </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.productId, item.size)}
                        disabled={updating === `${item.productId}-${item.size}`}
                        className="text-red-600 hover:text-red-700 mt-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('cart.subtotal')}</span>
                    <span className="font-semibold">{formatPrice(cart.itemsPrice)}</span>
                  </div>
                 
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t('cart.total')}</span>
                    <span className="text-[#438c71]">{formatPrice(cart.totalPrice)}</span>
                  </div>
                </div>

                <Button  variant="outline"
                  onClick={handleCheckout}
                  className="w-full px-4 mb-10 py-2 text-[20px] font-bold text-white bg-[#438c71] rounded-lg hover:bg-[#3a7a5f] transition-colors"
                >
                  {t('cart.checkout')}
                </Button>

                <Link href="/list">
                  <Button  variant="outline" 
                 className="w-full  mt-4 px-4 mb-10 py-2 text-[20px] font-bold text-white bg-[#438c71] rounded-lg hover:bg-[#3a7a5f] transition-colors"
                  
                  >
                    {t('cart.continueShopping')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;