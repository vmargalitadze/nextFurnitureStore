import React from "react";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FaShoppingCart,
  FaDollarSign,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaEdit,
  FaFilter,
  FaSearch,
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCalendar,
  FaPhone,
  FaEnvelope,
  FaUsers,
  FaChartLine,
  FaSort,
  FaSortUp,
  FaSortDown
} from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import Image from "next/image";

async function getAllOrders() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      },
      orderitems: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              titleEn: true,
              category: true,
              images: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return orders;
}

async function getOrderStatistics() {
  const totalOrders = await prisma.order.count();
  const totalUsers = await prisma.user.count();
  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      totalPrice: true
    }
  });
  const pendingOrders = await prisma.order.count({
    where: {
      isPaid: false
    }
  });
  const deliveredOrders = await prisma.order.count({
    where: {
      isDelivered: true
    }
  });

  // Get top customers by order count
  const topCustomers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: {
          Order: true
        }
      }
    },
    orderBy: {
      Order: {
        _count: 'desc'
      }
    },
    take: 5
  });

  return {
    totalOrders,
    totalUsers,
    totalRevenue: totalRevenue._sum.totalPrice || 0,
    pendingOrders,
    deliveredOrders,
    topCustomers
  };
}

export default async function OrdersPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const orders = await getAllOrders();
  const stats = await getOrderStatistics();

  // Calculate additional statistics
  const averageOrderValue = stats.totalOrders > 0 ? Number(stats.totalRevenue) / stats.totalOrders : 0;
  const uniqueCustomers = new Set(orders.map(order => order.user.id)).size;
  const recentOrders = orders.slice(0, 10); // Latest 10 orders

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Users Order Management</h1>
            <p className="text-gray-600">Comprehensive view of all customer orders across the website</p>
          </div>
          <Link href="/adminall">
            <Button className="mt-4 sm:mt-0" variant="outline">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  <p className="text-blue-200 text-xs">Across all users</p>
                </div>
                <div className="text-blue-200">
                  <FaShoppingCart className="text-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold">₾{Number(stats.totalRevenue).toFixed(2)}</p>
                  <p className="text-green-200 text-xs">From all orders</p>
                </div>
                <div className="text-green-200">
                  <FaDollarSign className="text-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Active Customers</p>
                  <p className="text-2xl font-bold">{uniqueCustomers}</p>
                  <p className="text-purple-200 text-xs">With orders</p>
                </div>
                <div className="text-purple-200">
                  <FaUsers className="text-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Pending Orders</p>
                  <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                  <p className="text-orange-200 text-xs">Awaiting payment</p>
                </div>
                <div className="text-orange-200">
                  <FaClock className="text-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Customers Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaUsers className="text-blue-500" />
              Top Customers by Order Count
            </CardTitle>
            <CardDescription>
              Users with the most orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.topCustomers.map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{customer._count.Order}</p>
                    <p className="text-xs text-gray-500">orders</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FaShoppingCart className="text-blue-500" />
                  All Users Orders ({orders.length})
                </CardTitle>
                <CardDescription>
                  Complete order history from all customers with detailed information
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search orders..."
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <FaFilter className="mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-semibold">Order ID</th>
                      <th className="text-left p-4 font-semibold">Customer Info</th>
                      <th className="text-left p-4 font-semibold">Order Details</th>
                      <th className="text-left p-4 font-semibold">Items</th>
                      <th className="text-left p-4 font-semibold">Total</th>
                      <th className="text-left p-4 font-semibold">Payment Status</th>
                      <th className="text-left p-4 font-semibold">Delivery Status</th>
                      <th className="text-left p-4 font-semibold">Date</th>
                      <th className="text-left p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <p className="font-mono text-sm font-medium">#{order.id.slice(-8)}</p>
                          <p className="text-xs text-gray-500">Full: {order.id}</p>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FaUser className="w-3 h-3 text-gray-500" />
                              <p className="font-medium">{order.user.name}</p>
                              {order.user.role === 'admin' && (
                                <Badge variant="default" className="text-xs">Admin</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <FaEnvelope className="w-3 h-3 text-gray-500" />
                              <p className="text-sm text-gray-600">{order.user.email}</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              Member since: {format(new Date(order.user.createdAt), 'MMM yyyy')}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FaCreditCard className="w-3 h-3 text-gray-500" />
                              <span className="text-sm font-medium">{order.paymentMethod}</span>
                            </div>
                            {order.shippingAddress && (
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="w-3 h-3 text-gray-500" />
                                <p className="text-xs text-gray-600">
                                  {typeof order.shippingAddress === 'object' && order.shippingAddress !== null
                                    ? `${(order.shippingAddress as any).city || 'N/A'}`
                                    : 'Address saved'
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">
                              {order.orderitems.length} items
                            </p>
                            <div className="space-y-1">
                              {order.orderitems.slice(0, 3).map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  {item.product.images[0] && (
                                    <Image
                                      src={item.product.images[0]}
                                      alt={item.title}
                                      className="w-6 h-6 object-cover rounded"
                                      width={24}
                                      height={24}
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{item.title}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                  </div>
                                </div>
                              ))}
                              {order.orderitems.length > 3 && (
                                <p className="text-xs text-gray-500">
                                  +{order.orderitems.length - 3} more items
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <p className="font-bold text-lg">₾{Number(order.totalPrice).toFixed(2)}</p>
                            <div className="text-xs text-gray-500 space-y-0.5">
                              <p>Items: ₾{Number(order.itemsPrice).toFixed(2)}</p>
                              <p>Shipping: ₾{Number(order.shippingPrice).toFixed(2)}</p>
                              <p>Tax: ₾{Number(order.taxPrice).toFixed(2)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-2">
                            {order.isPaid ? (
                              <Badge variant="default" className="w-full justify-center">
                                <FaCheckCircle className="w-3 h-3 mr-1" />
                                Paid
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="w-full justify-center">
                                <FaClock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                            {order.paidAt && (
                              <p className="text-xs text-gray-500 text-center">
                                {format(new Date(order.paidAt), 'MMM dd, yyyy')}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-2">
                            {order.isDelivered ? (
                              <Badge variant="default" className="w-full justify-center">
                                <FaTruck className="w-3 h-3 mr-1" />
                                Delivered
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="w-full justify-center">
                                <FaTruck className="w-3 h-3 mr-1" />
                                In Transit
                              </Badge>
                            )}
                            {order.deliveredAt && (
                              <p className="text-xs text-gray-500 text-center">
                                {format(new Date(order.deliveredAt), 'MMM dd, yyyy')}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FaCalendar className="w-3 h-3 text-gray-500" />
                              <p className="text-sm font-medium">
                                {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {format(new Date(order.createdAt), 'HH:mm')}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/adminall/orders/${order.id}`}>
                              <Button size="sm" variant="outline" title="View Details">
                                <FaEye className="w-3 h-3" />
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline" title="Edit Order">
                              <FaEdit className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaShoppingCart className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6">Orders will appear here when customers make purchases</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 