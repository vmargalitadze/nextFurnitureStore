"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Package,
  Truck,
  Home,
  ShoppingBag,
  User,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useSearchParams, useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/lib/context/CartContext";

interface OrderItem {
  productId: string;
  qty: number;
  price: number;
  title: string;
  image: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  idNumber: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  additionalInfo?: string;
}

interface Order {
  id: string;
  userId: string;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  orderitems: OrderItem[];
  deliveryLocation?: string; // Added for delivery location
}

const OrderConfirmationPage = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const params = useParams();
  const { updateCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Get order ID from URL params first, then try sessionStorage as fallback
        let orderId = searchParams.get("orderId");
        
        // If no orderId in URL, try to get it from sessionStorage
        if (!orderId) {
          orderId = sessionStorage.getItem("lastOrderId");
          if (orderId) {
            // Clear it from sessionStorage after using it
            sessionStorage.removeItem("lastOrderId");
          }
        }

        let url = "/api/orders/latest";
        if (orderId) {
          url = `/api/orders/${orderId}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }

        const data = await response.json();
        setOrder(data.order);
        
        // Clear the cart after successfully loading the order
        updateCart(null);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [searchParams, updateCart]);
console.log(order?.deliveryLocation);

  const formatPrice = (price: number | string | undefined) => {
    if (price === undefined || price === null)
      return params.locale === "ge" ? "0 ლარი" : "₾0.00";
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(numPrice)) return params.locale === "ge" ? "0 ლარი" : "₾0.00";

    // Format based on locale
    if (params.locale === "ge") {
      return `${numPrice.toFixed(2)} ლარი`;
    } else {
      return `₾${numPrice.toFixed(2)}`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 5); // 3-5 business days
    return deliveryDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container mt-[120px] mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-full w-16 mx-auto mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
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

  if (error || !order) {
    return (
      <div className="container mt-[120px] min-h-screen mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('orderConfirmation.orderNotFound')}
            </h1>
            <p className="text-gray-600 mb-8">
              {error || t('orderConfirmation.orderNotFoundMessage')}
            </p>
            <Link href="/">
              <Button className="bg-[#438c71] hover:bg-[#3a7a5f]">
                {t('orderConfirmation.continueShopping')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const address = order.shippingAddress;


  return (
    <div className="container  mt-[120px] mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="md:text-3xl text-[20px] font-bold text-gray-900 mb-2">
            {t('orderConfirmation.title')}
          </h1>
          <p className="text-gray-600">{t('orderConfirmation.thankYou')}</p>
          <p className="text-gray-600">
            {t('orderConfirmation.processingMessage')}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex text-[20px] font-bold items-center">
              <Package className="h-5 w-5 mr-2" />
              {t('orderConfirmation.orderDetails')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t('orderConfirmation.orderNumber')}</p>
                <p className="font-semibold">
                  #{order.id.slice(-8).toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('orderConfirmation.orderDate')}</p>
                <p className="font-semibold">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('orderConfirmation.estimatedDelivery')}</p>
                <p className="font-semibold">{getEstimatedDelivery()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('orderConfirmation.paymentStatus')}</p>
                <p className="font-semibold text-green-600">
                  {order.isPaid ? t('orderConfirmation.paid') : t('orderConfirmation.pending')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex text-[20px] font-bold items-center">
            
              {t('orderConfirmation.customerInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-col items-start md:flex-row md:items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">
                  {address.firstName} {address.lastName}
                </span>
              </div>
              <div className="flex flex-col items-start md:flex-row md:items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{address.phone}</span>
              </div>
              <div className="flex flex-col items-start md:flex-row md:items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{address.email}</span>
              </div>
              {address.idNumber && (
                <div className="flex flex-col items-start md:flex-row md:items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">ID: {address.idNumber}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex text-[20px] font-bold items-center">
              <Truck className="h-5 w-5 mr-2" />
              {t('orderConfirmation.deliveryInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Show delivery location/city if present */}
              {order.deliveryLocation && (
                <div className="flex flex-col items-start md:flex-row md:items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <span className="font-semibold">
                    {t(`productDetail.locations.${order.deliveryLocation}`, { defaultMessage: order.deliveryLocation.charAt(0).toUpperCase() + order.deliveryLocation.slice(1) })}
                    {order.deliveryLocation === "batumi" ? (
                      <>
                        <span className="text-gray-600 ml-2">
                          ({t("productDetail.locations.batumiAddress")})
                        </span>
                       
                      </>
                    ) : (
                      <span className="text-gray-600 ml-2">
                        ({t(`productDetail.locations.${order.deliveryLocation}Address`, { defaultMessage: "" })})
                      </span>
                    )}
                       {order.deliveryLocation === "batumi44" ? (
                      <>
                        <span className="text-gray-600 ml-2">
                          ({t("productDetail.locations.batumiAddress2")})
                        </span>
                       
                      </>
                    ) : (
                      <span className="text-gray-600 ml-2">
                        ({t(`productDetail.locations.${order.deliveryLocation}Address`, { defaultMessage: "" })})
                      </span>
                    )}
                  </span>
                </div>
              )}
              <div className="flex items-start space-x-2">
           
                <div>
                  <p className="font-semibold">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="text-gray-600">{address.streetAddress}</p>
                  <p className="text-gray-600">
                    {address.city}, {address.postalCode}
                  </p>
                  <p className="text-gray-600">{address.country}</p>
                  <p className="text-gray-600">{address.phone}</p>
                  {address.additionalInfo && (
                    <p className="text-gray-600 text-sm mt-1">
                      Additional Info: {address.additionalInfo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex text-[20px] font-bold items-center">
              <Package className="h-5 w-5 mr-2" />
              {t('orderConfirmation.orderSummary')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.orderitems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Image
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-md"
                    width={48}
                    height={48}
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {t('orderConfirmation.quantity')}: {item.qty}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('orderConfirmation.subtotal')}</span>
                  <span className="font-semibold">
                    {formatPrice(order.itemsPrice)}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>{t('orderConfirmation.total')}</span>
                  <span className="text-[#438c71]">
                    {formatPrice(order.totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="flex-1">
            <Button className="w-full px-4 mb-3 py-2 text-[20px] font-bold text-white bg-[#438c71] rounded-lg hover:bg-[#3a7a5f] transition-colors">
              <Home className="h-4 w-4 mr-2" />
              {t('orderConfirmation.continueShopping')}
            </Button>
          </Link>
          <Link href="/profile" className="flex-1">
            <Button className="w-full px-4 mb-10 py-2 text-[20px] font-bold text-white bg-[#438c71] rounded-lg hover:bg-[#3a7a5f] transition-colors">
              <ShoppingBag className="h-4 w-4 mr-2" />
              {t('orderConfirmation.viewOrders')}
            </Button>
          </Link>
        </div>

        <div className=" text-center">
          <p className="text-sm text-gray-600">
            {t('orderConfirmation.emailConfirmation')}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {t('orderConfirmation.contactSupport')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
