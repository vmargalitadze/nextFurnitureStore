'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { getMyCart } from '@/lib/actions/cart.actions';
import { CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { MapPin, CreditCard, Truck, ArrowLeft, CheckCircle, User, Phone, Mail, Home } from 'lucide-react';
import {Link} from '@/i18n/navigation';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useCart } from '@/lib/context/CartContext';
import Image from 'next/image';

interface Cart {
  id: string;
  items: CartItem[];
  itemsPrice: string;
  totalPrice: string;
  shippingPrice: string;
  taxPrice: string;
}

interface DeliveryAddress {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  idNumber: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  additionalInfo: string;
}

const CheckoutPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const { cart, updateCart, refreshCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [address, setAddress] = useState<DeliveryAddress>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    idNumber: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: 'Georgia',
    additionalInfo: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<DeliveryAddress>>({});

  const loadCart = useCallback(async () => {
    try {
      const response = await fetch('/api/cart/get');
      if (!response.ok) {
        throw new Error('Failed to load cart');
      }
      
      const { cart: cartData } = await response.json();
      if (cartData) {
        updateCart({
          id: cartData.id,
          items: cartData.items,
          itemsPrice: cartData.itemsPrice,
          totalPrice: cartData.totalPrice,
          shippingPrice: cartData.shippingPrice,
          taxPrice: cartData.taxPrice,
        });
      } else {
        updateCart(null);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [updateCart]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleAddressChange = (field: keyof DeliveryAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<DeliveryAddress> = {};

    if (!address.firstName.trim()) {
      newErrors.firstName = t('checkout.validation.firstNameRequired');
    }
    if (!address.lastName.trim()) {
      newErrors.lastName = t('checkout.validation.lastNameRequired');
    }
    if (!address.phone.trim()) {
      newErrors.phone = t('checkout.validation.phoneRequired');
    } else if (!/^(\+995|995)?[0-9]{9}$/.test(address.phone.replace(/\s/g, ''))) {
      newErrors.phone = t('checkout.validation.phoneInvalid');
    }
    if (!address.email.trim()) {
      newErrors.email = t('checkout.validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      newErrors.email = t('checkout.validation.emailInvalid');
    }
    if (!address.idNumber.trim()) {
      newErrors.idNumber = t('checkout.validation.idNumberRequired');
    } else if (!/^[0-9]{11}$/.test(address.idNumber.replace(/\s/g, ''))) {
      newErrors.idNumber = t('checkout.validation.idNumberInvalid');
    }
    if (!address.streetAddress.trim()) {
      newErrors.streetAddress = t('checkout.validation.streetAddressRequired');
    }
    if (!address.city.trim()) {
      newErrors.city = t('checkout.validation.cityRequired');
    }
    if (!address.postalCode.trim()) {
      newErrors.postalCode = t('checkout.validation.postalCodeRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDeliveryPrice = () => {
    if (!cart) return 0;
    
    // Calculate shipping based on delivery option and cart total
    const itemsPrice = parseFloat(cart.itemsPrice);
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
        return shippingPrice + 15;
      case 'same-day':
        return shippingPrice + 25;
      default:
        return shippingPrice;
    }
  };

  const calculateTotalPrice = () => {
    if (!cart) return 0;
    const itemsPrice = parseFloat(cart.itemsPrice);
    const taxPrice = parseFloat(cart.taxPrice);
    const deliveryPrice = calculateDeliveryPrice();
    return itemsPrice + taxPrice + deliveryPrice;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error(t('checkout.errors.tryAgain'));
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: address,
          paymentMethod,
          deliveryOption,
          cartId: cart?.id,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Order failed');
      }
      toast.success(t('checkout.success'));
      
      // Clear the cart context to update the cart icon
      updateCart(null);
      
      // Refresh cart context to ensure it's synchronized with server
      await refreshCart();
      
      // Small delay to ensure cart context is updated before redirect
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirect to order confirmation with the order ID
      router.push(`/${params.locale}/order-confirmation?orderId=${data.order.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(t('checkout.errors.orderFailed'));
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (params.locale === 'ge') {
      return `${numPrice.toFixed(2)} ლარი`;
    } else {
      return `₾${numPrice.toFixed(2)}`;
    }
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
      <div className="container min-h-screen mx-auto px-4 py-8">
        <div className="max-w-4xl mt-[120px] mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('checkout.errors.cartEmpty')}
            </h1>
            <p className="text-gray-600 mb-8">
              {t('cart.emptyDescription')}
            </p>
            <Link href="/list">
              <Button className="w-full px-4 mb-10 py-2 text-[20px] font-bold text-white bg-[#438c71] rounded-lg hover:bg-[#3a7a5f] transition-colors">
                {t('cart.continueShopping')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container min-h-screen mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/cart">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('cart.title')}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{t('checkout.title')}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  {t('checkout.personalInformation.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t('checkout.personalInformation.firstName')} *</Label>
                    <Input
                      id="firstName"
                      value={address.firstName}
                      onChange={(e) => handleAddressChange('firstName', e.target.value)}
                      placeholder={t('checkout.personalInformation.firstNamePlaceholder')}
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t('checkout.personalInformation.lastName')} *</Label>
                    <Input
                      id="lastName"
                      value={address.lastName}
                      onChange={(e) => handleAddressChange('lastName', e.target.value)}
                      placeholder={t('checkout.personalInformation.lastNamePlaceholder')}
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">{t('checkout.personalInformation.phone')} *</Label>
                    <Input
                      id="phone"
                      value={address.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      placeholder={t('checkout.personalInformation.phonePlaceholder')}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">{t('checkout.personalInformation.email')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={address.email}
                      onChange={(e) => handleAddressChange('email', e.target.value)}
                      placeholder={t('checkout.personalInformation.emailPlaceholder')}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="idNumber">{t('checkout.personalInformation.idNumber')} *</Label>
                  <Input
                    id="idNumber"
                    value={address.idNumber}
                    onChange={(e) => handleAddressChange('idNumber', e.target.value)}
                    placeholder={t('checkout.personalInformation.idNumberPlaceholder')}
                    className={errors.idNumber ? 'border-red-500' : ''}
                  />
                  {errors.idNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {t('checkout.deliveryAddress.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="streetAddress">{t('checkout.deliveryAddress.streetAddress')} *</Label>
                  <Input
                    id="streetAddress"
                    value={address.streetAddress}
                    onChange={(e) => handleAddressChange('streetAddress', e.target.value)}
                    placeholder={t('checkout.deliveryAddress.streetAddressPlaceholder')}
                    className={errors.streetAddress ? 'border-red-500' : ''}
                  />
                  {errors.streetAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">{t('checkout.deliveryAddress.city')} *</Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      placeholder={t('checkout.deliveryAddress.cityPlaceholder')}
                      className={errors.city ? 'border-red-500' : ''}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="postalCode">{t('checkout.deliveryAddress.postalCode')} *</Label>
                    <Input
                      id="postalCode"
                      value={address.postalCode}
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                      placeholder={t('checkout.deliveryAddress.postalCodePlaceholder')}
                      className={errors.postalCode ? 'border-red-500' : ''}
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="country">{t('checkout.deliveryAddress.country')}</Label>
                    <Input
                      id="country"
                      value={address.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      placeholder={t('checkout.deliveryAddress.country')}
                      disabled
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="additionalInfo">{t('checkout.deliveryAddress.additionalInfo')}</Label>
                  <Input
                    id="additionalInfo"
                    value={address.additionalInfo}
                    onChange={(e) => handleAddressChange('additionalInfo', e.target.value)}
                    placeholder={t('checkout.deliveryAddress.additionalInfoPlaceholder')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  {t('checkout.deliveryOptions.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">{t('checkout.deliveryOptions.title')}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="standard"
                        name="delivery"
                        value="standard"
                        checked={deliveryOption === 'standard'}
                        onChange={() => setDeliveryOption('standard')}
                        className="text-[#438c71]"
                      />
                      <label htmlFor="standard" className="text-sm flex-1">
                        <div className="font-medium">{t('checkout.deliveryOptions.standard')}</div>
                        <div className="text-gray-600">{t('checkout.deliveryOptions.standardDesc')}</div>
                      </label>
                      <span className="font-semibold">{t('checkout.deliveryOptions.standardPrice')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="express"
                        name="delivery"
                        value="express"
                        checked={deliveryOption === 'express'}
                        onChange={() => setDeliveryOption('express')}
                        className="text-[#438c71]"
                      />
                      <label htmlFor="express" className="text-sm flex-1">
                        <div className="font-medium">{t('checkout.deliveryOptions.express')}</div>
                        <div className="text-gray-600">{t('checkout.deliveryOptions.expressDesc')}</div>
                      </label>
                      <span className="font-semibold">{t('checkout.deliveryOptions.expressPrice')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="same-day"
                        name="delivery"
                        value="same-day"
                        checked={deliveryOption === 'same-day'}
                        onChange={() => setDeliveryOption('same-day')}
                        className="text-[#438c71]"
                      />
                      <label htmlFor="same-day" className="text-sm flex-1">
                        <div className="font-medium">{t('checkout.deliveryOptions.sameDay')}</div>
                        <div className="text-gray-600">{t('checkout.deliveryOptions.sameDayDesc')}</div>
                      </label>
                      <span className="font-semibold">{t('checkout.deliveryOptions.sameDayPrice')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  {t('checkout.paymentOptions.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="card"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-[#438c71]"
                    />
                    <label htmlFor="card" className="text-sm">
                      {t('checkout.paymentOptions.card.title')}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="cash"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-[#438c71]"
                    />
                    <label htmlFor="cash" className="text-sm">
                      {t('checkout.paymentOptions.cash.title')}
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>{t('checkout.orderSummary.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="flex items-center space-x-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                        width={48}
                        height={48}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {t('productDetail.product.size')}: {formatSize(item.size)} | {t('cart.quantity')}: {item.qty}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatPrice((parseFloat(item.price) * item.qty).toString())}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('checkout.orderSummary.subtotal')}</span>
                    <span className="font-semibold">{formatPrice(cart.itemsPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('checkout.orderSummary.tax')}</span>
                    <span className="font-semibold">{formatPrice(cart.taxPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('checkout.orderSummary.shipping')}</span>
                    <span className="font-semibold">
                      {calculateDeliveryPrice() === 0 ? t('checkout.deliveryOptions.standard.price') : formatPrice(calculateDeliveryPrice().toString())}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t('checkout.orderSummary.total')}</span>
                    <span className="text-[#438c71]">{formatPrice(calculateTotalPrice().toString())}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="w-full bg-[#438c71] hover:bg-[#3a7a5f] text-white font-semibold py-3"
                  size="lg"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('checkout.orderSummary.processingOrder')}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t('checkout.orderSummary.placeOrder')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 