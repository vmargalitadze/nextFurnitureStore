import React from "react";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaSearch,
  FaFilter,
  FaSort,
  FaCrown,
  FaShoppingCart,
  FaDollarSign,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaUsers
} from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import Image from "next/image";
import DeleteProductButton from "@/components/DeleteProductButton";
import OrderManagementCard from "@/components/OrderManagementCard";
import UserManagementCard from "@/components/UserManagementCard";
import { useTranslations } from "next-intl";

async function getAllProducts() {
  const products = await prisma.product.findMany({
    include: {
      sizes: true,
      OrderItem: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return products;
}

async function getAllOrders() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      orderitems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return orders;
}

async function getAllUsers() {
  const users = await prisma.user.findMany({
    include: {
      Order: {
        include: {
          orderitems: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return users;
}

export default async function AdminAllPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const products = await getAllProducts();
  const orders = await getAllOrders();
  const users = await getAllUsers();

  // Calculate order statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => !order.isPaid).length;
  const deliveredOrders = orders.filter(order => order.isDelivered).length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);

  // Calculate user statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.Order.length > 0).length;
  const totalUserSpending = users.reduce((sum, user) => {
    return sum + user.Order.reduce((orderSum, order) => {
      return orderSum + Number(order.totalPrice);
    }, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your store, products, orders, and users</p>
          </div>
          <Link href="/new">
            <Button className="mt-4 sm:mt-0" variant="default">
              <FaPlus className="mr-2" />
              Add New Product
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <div className="text-blue-200">
                  <FaCrown className="text-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
                <div className="text-green-200">
                  <FaShoppingCart className="text-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold">₾{totalRevenue.toFixed(2)}</p>
                </div>
                <div className="text-purple-200">
                  <FaDollarSign className="text-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Pending Orders</p>
                  <p className="text-2xl font-bold">{pendingOrders}</p>
                </div>
                <div className="text-orange-200">
                  <FaClock className="text-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Total Users</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <div className="text-indigo-200">
                  <FaUsers className="text-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Products Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Products</CardTitle>
                <CardDescription>
                  View and manage all products in your inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                {products.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-semibold">Product</th>
                          <th className="text-left p-4 font-semibold">Category</th>
                          <th className="text-left p-4 font-semibold">Brand</th>
                          <th className="text-left p-4 font-semibold">Sizes</th>
                          <th className="text-left p-4 font-semibold">Sales</th>
                          <th className="text-left p-4 font-semibold">Status</th>
                          <th className="text-left p-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                {product.images && product.images.length > 0 && (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.title}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                )}
                                <div>
                                  <p className="font-medium">{product.title}</p>
                                  <p className="text-sm text-gray-500">{product.titleEn}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline">
                                {product.category}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <p className="font-medium">{product.brand}</p>
                            </td>
                            <td className="p-4">
                              <p className="text-sm text-gray-600">
                                {product.sizes.length} sizes
                              </p>
                            </td>
                            <td className="p-4">
                              <p className="font-medium">{product.sales || 0}</p>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col gap-1">
                                {product.popular && (
                                  <Badge variant="default" className="text-xs">
                                    Popular
                                  </Badge>
                                )}
                                <div className="flex gap-1">
                                  {product.tbilisi && (
                                    <Badge variant="secondary" className="text-xs">
                                      Tbilisi
                                    </Badge>
                                  )}
                                  {product.batumi && (
                                    <Badge variant="secondary" className="text-xs">
                                      Batumi
                                    </Badge>
                                  )}
                                  {product.qutaisi && (
                                    <Badge variant="secondary" className="text-xs">
                                      Qutaisi
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Link href={`/products/${product.id}`}>
                                  <Button size="sm" variant="outline">
                                    <FaEye className="w-3 h-3" />
                                  </Button>
                                </Link>
                                <Link href={`/edit?id=${product.id}`}>
                                  <Button size="sm" variant="outline">
                                    <FaEdit className="w-3 h-3" />
                                  </Button>
                                </Link>
                                
                                <DeleteProductButton productId={product.id} />
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
                      <FaPlus className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                    <p className="text-gray-500 mb-6">Get started by adding your first product</p>
                    <Link href="/new">
                      <Button variant="default">
                        <FaPlus className="mr-2" />
                        Add First Product
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            {/* Enhanced Orders Section */}
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>
                  View and manage all customer orders with detailed buyer information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <OrderManagementCard
                        key={order.id}
                        order={{
                          ...order,
                          itemsPrice: order.itemsPrice.toString(),
                          shippingPrice: order.shippingPrice.toString(),
                          taxPrice: order.taxPrice.toString(),
                          totalPrice: order.totalPrice.toString(),
                          orderitems: order.orderitems.map(item => ({
                            ...item,
                            price: Number(item.price)
                          }))
                        }}
                      />
                    ))}
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
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* Users Management Section */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View all users checkout information, buying history, and status details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {users.length > 0 ? (
                  <div className="space-y-6">
                    {users.map((user) => (
                      <UserManagementCard
                        key={user.id}
                        user={{
                          ...user,
                          orders: user.Order.map(order => ({
                            ...order,
                            itemsPrice: order.itemsPrice.toString(),
                            shippingPrice: order.shippingPrice.toString(),
                            taxPrice: order.taxPrice.toString(),
                            totalPrice: order.totalPrice.toString(),
                            orderitems: order.orderitems.map(item => ({
                              ...item,
                              price: Number(item.price)
                            }))
                          }))
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FaUsers className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users yet</h3>
                    <p className="text-gray-500 mb-6">Users will appear here when they register</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}



