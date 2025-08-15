'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {  FaClock, FaCheckCircle, FaTruck } from "react-icons/fa";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

interface OrderItem {
  image: string;
  orderId: string;
  productId: string;
  qty: number;
  price: number; // Converted from Decimal
  title: string;
}

interface Order {
  id: string;
  createdAt: string | Date;
  totalPrice: number; // Converted from Decimal
  isPaid: boolean;
  isDelivered: boolean;
  paymentMethod: string;
  orderitems: OrderItem[];
}

interface RecentOrdersProps {
  orders: Order[];
  onOrdersUpdate?: (orders: Order[]) => void;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders, onOrdersUpdate }) => {
  const t = useTranslations("profile");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const refreshBOGOrders = async () => {
    setIsRefreshing(true);
    try {
      // Refresh each BOG order status
      const updatedOrders = await Promise.all(
        localOrders
          .filter(order => order.paymentMethod?.includes('BOG'))
          .map(async (order) => {
            try {
              const response = await fetch(`/api/orders/bog-status/${order.id}`);
              if (response.ok) {
                const data = await response.json();
                return data.order;
              }
            } catch (error) {
              console.error(`Failed to refresh order ${order.id}:`, error);
            }
            return order;
          })
      );

      // Update local state
      const newOrders = localOrders.map(order => {
        const updatedOrder = updatedOrders.find(uo => uo.id === order.id);
        return updatedOrder || order;
      });

      setLocalOrders(newOrders);
      if (onOrdersUpdate) {
        onOrdersUpdate(newOrders);
      }
    } catch (error) {
      console.error('Error refreshing BOG orders:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = (order: Order) => {
    if (order.isPaid) {
      return <FaCheckCircle className="w-4 h-4 text-green-600" />;
    } else if (order.paymentMethod?.includes('BOG')) {
      return <FaClock className="w-4 h-4 text-orange-600" />;
    } else {
      return <FaClock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (order: Order) => {
    if (order.isPaid) {
      return t("recentOrders.paid");
    } else if (order.paymentMethod?.includes('BOG')) {
      return 'ფიქრობს';
    } else {
      return t("recentOrders.pending");
    }
  };

  const getStatusVariant = (order: Order) => {
    if (order.isPaid) {
      return "default";
    } else if (order.paymentMethod?.includes('BOG')) {
      return "secondary";
    } else {
      return "secondary";
    }
  };

  if (!localOrders || localOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t("recentOrders.title")}
          </CardTitle>
          <CardDescription>
            {t("recentOrders.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaClock className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("recentOrders.noOrders")}
            </h3>
            <p className="text-gray-500">
              {t("recentOrders.noOrdersDescription")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {t("recentOrders.title")}
            </CardTitle>
            <CardDescription>
              {t("recentOrders.description")}
            </CardDescription>
          </div>
        
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {localOrders.map((order) => (
            <div key={order.id} className="block">
              <div className="flex items-center justify-between p-3.5 border rounded-lg hover:bg-gray-50 transition">
                <div>
                  <p className="font-medium">
                    {t("recentOrders.orderNumber", {
                      number: order.id.slice(-8),
                    })}
                  </p>
                  <p className="text-[16px] text-gray-500">
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("recentOrders.total", {
                      amount: order.totalPrice,
                    })}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(order)}
                    <Badge
                      className="text-[16px]"
                      variant={getStatusVariant(order)}
                    >
                      {getStatusText(order)}
                    </Badge>
                  </div>
                  {order.isDelivered && (
                    <Badge variant="outline" className="ml-2">
                      <FaTruck className="w-3 h-3 mr-1" />
                      {t("recentOrders.delivered")}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
