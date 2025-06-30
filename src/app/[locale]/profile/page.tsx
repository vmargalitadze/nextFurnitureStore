import React from "react";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  FaEnvelope,
  FaCalendarAlt,
 
  FaPlus,
  FaMapMarkerAlt,
  FaCreditCard,
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
        orderBy: { createdAt: "desc" },
      },
      Cart: true,
    },
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
                <div className="mx-auto w-24 h-24  bg-orange-400 rounded-full flex items-center justify-center mb-4">
                  <User className="text-white text-3xl" />
                </div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <Badge
                    variant={isAdmin ? "default" : "secondary"}
                    className="text-sm"
                  >
                    {isAdmin ? (
                      <>
                      
                        <div className="text-2xl font-bold">
                          {t("admin")}
                        </div>

                      </>
                    ) : (
                      <div className="text-2xl font-bold">
                        {t("user")}
                      </div>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <FaEnvelope className="w-6 h-6 text-orange-600" />
                    </div>
                  <div>
                    <p className="text-sm text-gray-500">{t("email")}</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <FaCalendarAlt className="w-6 h-6 text-orange-600" />
                    </div>
                  <div>
                    <p className="text-sm text-gray-500">{t("memberSince")}</p>
                    <p className="font-medium">
                      {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                {user.address && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <FaMapMarkerAlt className="w-6 h-6 text-orange-600" />
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">{t("address")}</p>
                      <p className="font-medium text-sm">
                        {typeof user.address === "object" &&
                          user.address !== null
                          ? `${(user.address as any).street || ""} ${(user.address as any).city || ""}`
                          : t("addressSaved")}
                      </p>
                    </div>
                  </div>
                )}

                {user.paymentMethod && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <FaCreditCard className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("paymentMethod")}
                      </p>
                      <p className="font-medium text-sm">
                        •••• •••• •••• {user.paymentMethod.slice(-4)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex justify-center">
                    <Link className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline" href="/forgot-password">
                      {t("recoverPassword")}
                    </Link>
              
                </div>

                {/* Sign Out Button */}
                <div className="pt-3">
                  <SignOutButton />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-orange-400 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">
                        {t("totalOrders")}
                      </p>
                      <p className="text-2xl font-bold">{orderCount}</p>
                    </div>
                    <List className="text-2xl text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-400 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">{t("cartItems")}</p>
                      <p className="text-2xl font-bold">{cartItemCount}</p>
                    </div>
                    <ShoppingCart className="text-2xl text-green-200" />
                  </div>
                </CardContent>
              </Card>

         
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
               
                    <div className="text-2xl font-bold">

                      {t("adminActions.title")}
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {t("adminActions.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/new">
                      <Button
                        className="w-full px-4 mb-10 py-2 text-[20px] font-bold text-white bg-[#438c71] rounded-lg hover:bg-[#3a7a5f] transition-colors"
                        variant="default"
                      >
                        <FaPlus className="mr-2" />
                        {t("adminActions.addNewProduct")}
                      </Button>
                    </Link>
                    <Link href="/adminall">
                      <Button
                        className="w-full px-4 mb-10 py-2 text-[20px] font-bold text-white bg-[#438c71] rounded-lg hover:bg-[#3a7a5f] transition-colors"
                        variant="outline"
                      >
                        <List className="mr-2" />
                        მოქმედებები
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="text-2xl font-bold">
                  {t("recentOrders.title")}
                </div>

                <CardDescription>
                  {t("recentOrders.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.Order && user.Order.length > 0 ? (
                  <div className="space-y-4">
                    {user.Order.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {t("recentOrders.orderNumber", {
                              number: order.id.slice(-8),
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(order.createdAt), "MMM dd, yyyy")}
                          </p>
                          <p className="text-sm text-gray-500">
                            {t("recentOrders.total", {
                              amount: order.totalPrice.toString(),
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={order.isPaid ? "default" : "secondary"}
                          >
                            {order.isPaid
                              ? t("recentOrders.paid")
                              : t("recentOrders.pending")}
                          </Badge>
                          {order.isDelivered && (
                            <Badge variant="outline" className="ml-2">
                              {t("recentOrders.delivered")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="mx-auto text-4xl mb-4 text-gray-300" />
                    <p>{t("recentOrders.noOrders")}</p>
                    <p className="text-sm">
                      {t("recentOrders.noOrdersDescription")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t("quickActions.title")}</CardTitle>
                <CardDescription>
                  {t("quickActions.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/cart">
                    <Button
                      className="w-full  flex justify-center mx-auto items-center mb-14 px-4 py-2 text-[20px] font-bold text-[#438c71] bg-white border-2 border-[#438c71] rounded-lg hover:bg-[#438c71] hover:text-white transition-colors flex items-center justify-center gap-2"

                    >
                      <ShoppingCart className="mr-2" />
                      {t("quickActions.viewCart")}
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
