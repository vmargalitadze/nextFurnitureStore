import React from "react";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaSearch,
  FaFilter,
  FaSort,
  FaCrown
} from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import Image from "next/image";
import DeleteProductButton from "@/components/DeleteProductButton";

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

export default async function AdminAllPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const products = await getAllProducts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
            <p className="text-gray-600">Manage all products in your store</p>
          </div>
          <Link href="/new">
            <Button className="mt-4 sm:mt-0" variant="default">
              <FaPlus className="mr-2" />
              Add New Product
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  <p className="text-green-100 text-sm">Popular Products</p>
                  <p className="text-2xl font-bold">
                    {products.filter(p => p.popular).length}
                  </p>
                </div>
                <div className="text-green-200">
                  <FaEye className="text-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Sales</p>
                  <p className="text-2xl font-bold">
                    {products.reduce((sum, p) => sum + (p.sales || 0), 0)}
                  </p>
                </div>
                <div className="text-purple-200">
                  <FaSort className="text-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Categories</p>
                  <p className="text-2xl font-bold">
                    {new Set(products.map(p => p.category)).size}
                  </p>
                </div>
                <div className="text-orange-200">
                  <FaFilter className="text-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
      </div>
    </div>
  );
}



