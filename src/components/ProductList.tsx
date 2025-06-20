"use client";
import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import ProductHelper from "./ProductHelper";
import { useTranslations } from "next-intl";
import { getAllProducts } from "@/lib/actions/actions";
import { Decimal } from "@prisma/client/runtime/library";

interface ProductSize {
  id: string;
  size: string;
  price: Decimal;
}

interface Product {
  id: string;
  title: string;
  titleEn: string;
  category: string;
  images: string[];
  brand: string;
  description: string;
  descriptionEn: string;
  popular: boolean;
  createdAt: Date;
  tbilisi: boolean;
  batumi: boolean;
  qutaisi: boolean;
  sizes?: ProductSize[];
  size?: string;
  price?: Decimal;
  sales?: number;
}

function ProductList() {
  const t = useTranslations("productList");
  const [activeCategory, setActiveCategory] = useState("new-arrival");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data as Product[]);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper function to get product price range
  const getProductPriceRange = (product: Product) => {
    if (product.sizes && product.sizes.length > 0) {
      const prices = product.sizes.map((s) => Number(s.price));
      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
      };
    }
    if (product.price) {
      const price = Number(product.price);
      return { min: price, max: price };
    }
    return { min: 0, max: 0 };
  };

  // Filter products based on category
  const getFilteredProducts = () => {
    if (!products.length) return [];

    switch (activeCategory) {
      case "new-arrival":
        // Get 4 most recent products
        return products
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 4);
      case "sales":
        // Get products with sales > 0, sorted by sales
        return products
          .filter((product) => (product.sales || 0) > 0)
          .sort((a, b) => (b.sales || 0) - (a.sales || 0))
          .slice(0, 4);
      case "trending":
        // Get popular products
        return products.filter((product) => product.popular).slice(0, 4);
      default:
        return products.slice(0, 4);
    }
  };

  // Transform database products to match ProductHelper interface
  const transformProducts = (products: Product[]) => {
    return products.map((product) => {
      const priceRange = getProductPriceRange(product);
      return {
        id: product.id,
        image: product.images,
        price: priceRange.min,
        title: product.title,
      };
    });
  };

  const filteredProducts = getFilteredProducts();
  const transformedProducts = transformProducts(filteredProducts);

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Modern Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-primary font-secondary font-normal text-4xl md:text-[60px] block -ml-5 -mb-3 sm:-mb-[30px] leading-normal sm:leading-normal">
              {t("title")}
            </h2>
            <h6 className="text-lg mt-7 text-gray-600 max-w-2xl mx-auto font-secondary">
              {t("subtitle")}
            </h6>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap flex-col sm:flex-row justify-center gap-4 md:gap-6 mb-16">
            <button
              onClick={() => setActiveCategory("new-arrival")}
              className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeCategory === "new-arrival"
                  ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200"
              }`}
            >
              {t("newArrival")}
            </button>
            <button
              onClick={() => setActiveCategory("sales")}
              className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeCategory === "sales"
                  ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200"
              }`}
            >
              {t("sales")}
            </button>
            <button
              onClick={() => setActiveCategory("trending")}
              className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeCategory === "trending"
                  ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200"
              }`}
            >
              {t("trending")}
            </button>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl h-80 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : transformedProducts.length > 0 ? (
            <div className="mb-16">
              <ProductHelper items={transformedProducts} />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                პროდუქტი ვერ მოიძებნა
              </h3>
              <p className="text-gray-600">ამ კატეგორიაში პროდუქტები არ არის</p>
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mx-auto mt-7 md:mt-12">
            <Link
              className="btn-all btn-outline"
              href="/all"
              data-discover="true"
            >
              <span>{t("viewAll")}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductList;
