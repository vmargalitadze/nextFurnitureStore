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
import { getTranslations } from "next-intl/server";
import SignOutButton from "@/components/SignOutButton";

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
  const t = await getTranslations("profile");
  
  if (!user) {
    redirect("/sign-in");
  }

  const isAdmin = user.role === "admin";
  const orderCount = user.Order?.length || 0;
  const cartItemCount = user.Cart?.[0]?.items?.length || 0;

  return (
    <div className="min-h-screen mt-9 bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
       
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
                        {t('admin')}
                      </>
                    ) : (
                      t('user')
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaEnvelope className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">{t('email')}</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaCalendarAlt className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">{t('memberSince')}</p>
                    <p className="font-medium">
                      {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                {user.address && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaMapMarkerAlt className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t('address')}</p>
                      <p className="font-medium text-sm">
                        {typeof user.address === 'object' && user.address !== null
                          ? `${(user.address as any).street || ''} ${(user.address as any).city || ''}`
                          : t('addressSaved')
                        }
                      </p>
                    </div>
                  </div>
                )}

                {user.paymentMethod && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaCreditCard className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t('paymentMethod')}</p>
                      <p className="font-medium text-sm">•••• •••• •••• {user.paymentMethod.slice(-4)}</p>
                    </div>
                  </div>
                )}

       <Link 
              href="/forgot-password" 
              className="inline-block px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 text-gray-700   "
            >
            <Button className="w-full h-16 text-lg" variant="default">
                      
                      {t('recoverPassword')}
                      </Button>
            </Link>
            
                {/* Sign Out Button */}
                <div className="pt-4">
                  <SignOutButton />
                </div>
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
                      <p className="text-blue-100 text-sm">{t('totalOrders')}</p>
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
                      <p className="text-green-100 text-sm">{t('cartItems')}</p>
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
                      <p className="text-purple-100 text-sm">{t('accountType')}</p>
                      <p className="text-2xl font-bold">{isAdmin ? t('admin') : t('user')}</p>
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
                    {t('adminActions.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('adminActions.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/new">
                      <Button className="w-full h-16 text-lg" variant="default">
                        <FaPlus className="mr-2" />
                        {t('adminActions.addNewProduct')}
                      </Button>
                    </Link>
                    <Link href="/adminall">
                      <Button className="w-full h-16 text-lg" variant="outline">
                        <FaList className="mr-2" />
                        {t('adminActions.manageAllProducts')}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>{t('recentOrders.title')}</CardTitle>
                <CardDescription>
                  {t('recentOrders.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.Order && user.Order.length > 0 ? (
                  <div className="space-y-4">
                    {user.Order.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{t('recentOrders.orderNumber', { number: order.id.slice(-8) })}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(order.createdAt), "MMM dd, yyyy")}
                          </p>
                          <p className="text-sm text-gray-500">
                            {t('recentOrders.total', { amount: order.totalPrice.toString() })}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={order.isPaid ? "default" : "secondary"}>
                            {order.isPaid ? t('recentOrders.paid') : t('recentOrders.pending')}
                          </Badge>
                          {order.isDelivered && (
                            <Badge variant="outline" className="ml-2">
                              {t('recentOrders.delivered')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaShoppingCart className="mx-auto text-4xl mb-4 text-gray-300" />
                    <p>{t('recentOrders.noOrders')}</p>
                    <p className="text-sm">{t('recentOrders.noOrdersDescription')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('quickActions.title')}</CardTitle>
                <CardDescription>
                  {t('quickActions.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/cart">
                    <Button className="w-full" variant="outline">
                      <FaShoppingCart className="mr-2" />
                      {t('quickActions.viewCart')}
                    </Button>
                  </Link>
                  <Link href="/all">
                    <Button className="w-full" variant="outline">
                      <FaList className="mr-2" />
                      {t('quickActions.browseProducts')}
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
