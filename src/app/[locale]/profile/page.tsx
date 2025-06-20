import React from "react";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaCrown, 
  FaPlus, 
  FaList, 
  FaShoppingCart,
 
  FaMapMarkerAlt,
  FaCreditCard
} from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      Order: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      },
      Cart: true
    }
  });

  return user;
}

export default async function ProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  const isAdmin = user.role === "admin";
  const orderCount = user.Order?.length || 0;
  const cartItemCount = user.Cart?.[0]?.items?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Profile Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back, {user.name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <FaUser className="text-white text-3xl" />
                </div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant={isAdmin ? "default" : "secondary"} className="text-sm">
                    {isAdmin ? (
                      <>
                        <FaCrown className="mr-1" />
                        Admin
                      </>
                    ) : (
                      "User"
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaEnvelope className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaCalendarAlt className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">
                      {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                {user.address && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaMapMarkerAlt className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-sm">
                        {typeof user.address === 'object' && user.address !== null
                          ? `${(user.address as any).street || ''} ${(user.address as any).city || ''}`
                          : 'Address saved'
                        }
                      </p>
                    </div>
                  </div>
                )}

                {user.paymentMethod && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaCreditCard className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium text-sm">•••• •••• •••• {user.paymentMethod.slice(-4)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Orders</p>
                      <p className="text-2xl font-bold">{orderCount}</p>
                    </div>
                    <FaList className="text-2xl text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Cart Items</p>
                      <p className="text-2xl font-bold">{cartItemCount}</p>
                    </div>
                    <FaShoppingCart className="text-2xl text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Account Type</p>
                      <p className="text-2xl font-bold">{isAdmin ? 'Admin' : 'User'}</p>
                    </div>
                    <FaUser className="text-2xl text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaCrown className="text-yellow-500" />
                    Admin Actions
                  </CardTitle>
                  <CardDescription>
                    Manage your store and products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/new">
                      <Button className="w-full h-16 text-lg" variant="default">
                        <FaPlus className="mr-2" />
                        Add New Product
                      </Button>
                    </Link>
                    <Link href="/adminall">
                      <Button className="w-full h-16 text-lg" variant="outline">
                        <FaList className="mr-2" />
                        Manage All Products
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Your latest order history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.Order && user.Order.length > 0 ? (
                  <div className="space-y-4">
                    {user.Order.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Order #{order.id.slice(-8)}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(order.createdAt), "MMM dd, yyyy")}
                          </p>
                          <p className="text-sm text-gray-500">
                            Total: ${order.totalPrice.toString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={order.isPaid ? "default" : "secondary"}>
                            {order.isPaid ? 'Paid' : 'Pending'}
                          </Badge>
                          {order.isDelivered && (
                            <Badge variant="outline" className="ml-2">
                              Delivered
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaShoppingCart className="mx-auto text-4xl mb-4 text-gray-300" />
                    <p>No orders yet</p>
                    <p className="text-sm">Start shopping to see your orders here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and navigation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/cart">
                    <Button className="w-full" variant="outline">
                      <FaShoppingCart className="mr-2" />
                      View Cart
                    </Button>
                  </Link>
                  <Link href="/all">
                    <Button className="w-full" variant="outline">
                      <FaList className="mr-2" />
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
