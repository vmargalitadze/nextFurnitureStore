"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import ProductHelper from "@/components/ProductHelper";
import { getAllProducts } from "@/lib/actions/actions";
import { useTranslations } from "next-intl";
import SideBar from "@/components/Sidebar";

// Simple Decimal-like class to avoid Prisma import issues
class SimpleDecimal {
  value: string;

  constructor(value: string | number) {
    this.value = value.toString();
  }

  toString() {
    return this.value;
  }

  toNumber() {
    return parseFloat(this.value);
  }
}

interface ProductSize {
  id: string;
  size: string;
  price: SimpleDecimal;
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
  // Keep old fields for backward compatibility during migration
  size?: string;
  price?: SimpleDecimal;
  sales?: number;
}

interface FilterState {
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: { min: number; max: number };
}

function PageContentWrapper() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const t = useTranslations("common");

  // Get URL parameters
  const category = searchParams.get("cat");
  const brand = searchParams.get("brand");
  const query = searchParams.get("query") || "";

  // Check if sidebar should be shown (only when category or brand parameters exist)
  const shouldShowSidebar = Boolean(category || brand);

  const handleViewSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Helper function to get product price range
  const getProductPriceRange = (product: Product) => {
    if (product.sizes && product.sizes.length > 0) {
      const prices = product.sizes.map((s) => s.price.toNumber());
      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
      };
    }
    // Fallback to old structure
    if (product.price) {
      const price = product.price.toNumber();
      return { min: price, max: price };
    }
    return { min: 0, max: 0 };
  };

  // Handle filter changes from FilterSidebar
  const handleFilterChange = (filters: FilterState) => {
    const filtered = products.filter((product) => {
      // Category filter
      const matchesCategory =
        filters.selectedCategories.length === 0 ||
        filters.selectedCategories.includes(product.category);

      // Brand filter
      const matchesBrand =
        filters.selectedBrands.length === 0 ||
        filters.selectedBrands.includes(product.brand);

      // Search query filter
      const matchesQuery =
        !query ||
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.titleEn.toLowerCase().includes(query.toLowerCase());

      // Price range filter
      const priceRange = getProductPriceRange(product);
      const matchesPrice =
        priceRange.min >= filters.priceRange.min &&
        priceRange.max <= filters.priceRange.max;

      return matchesCategory && matchesBrand && matchesQuery && matchesPrice;
    });

    setFilteredProducts(filtered);
  };

  // Transform database products to match ProductHelper interface
  const transformedProducts = filteredProducts.map((product) => {
    const priceRange = getProductPriceRange(product);
    return {
      id: product.id,
      image: product.images,
      price: priceRange.min, // Show minimum price for display
      title: product.title,
    };
  });

  // Determine the page title based on filter type
  const getPageTitle = () => {
    if (query) return `Search: ${query}`;
    if (category) return category;
    if (brand) return brand;
    return t("products");
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      // Convert the data to match the Product interface
      const productsWithDecimalPrices = data.map((product) => ({
        ...product,
        sizes:
          product.sizes?.map((size) => ({
            ...size,
            price: new SimpleDecimal(size.price),
          })) || undefined,
        sales: product.sales || undefined,
      }));
      setProducts(productsWithDecimalPrices as Product[]);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply initial filters when products load or URL params change
  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter((product) => {
        const matchesCategory =
          !category ||
          product.category?.toLowerCase() === category.toLowerCase();
        const matchesBrand =
          !brand || product.brand?.toLowerCase() === brand.toLowerCase();
        const matchesQuery =
          !query ||
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.titleEn.toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesBrand && matchesQuery;
      });
      setFilteredProducts(filtered);
    }
  }, [products, category, brand, query]);

  // Loading state
  if (loading) {
    return (
      <>
        <div className="relative flex items-center justify-center bg-overlay p-14 sm:p-16 before:bg-title before:bg-opacity-70 overflow-hidden">
          <Image
            src="/bed.jpg"
            alt="Background"
            fill
            quality={80}
            className="object-cover z-0"
          />

          <div className="absolute inset-0 bg-black/60 z-10" />

          <div className="relative z-20 text-center w-full">
            <h2 className="text-primary text-xl md:text-[40px] font-normal leading-none text-center capitalize">
              {getPageTitle()}
            </h2>
          </div>
        </div>

        <div className="container min-h-screen mt-[50px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="relative min-h-[50vh] flex items-center justify-center bg-overlay p-14 sm:p-16 before:bg-title before:bg-opacity-70 overflow-hidden">
        <Image
          src="/bed.jpg"
          alt="Background"
          fill
          quality={80}
          className="object-cover z-0"
        />

        <div className="absolute inset-0 bg-black/60 z-10" />

        <div className="relative z-20 text-center w-full">
          <h2 className="text-primary text-xl md:text-[40px] font-normal leading-none text-center capitalize">
            {getPageTitle()}
          </h2>
          {filteredProducts.length > 0 && (
            <p className="text-white mt-2 text-[18px]">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} found
            </p>
          )}
        </div>
      </div>

      <div className="container min-h-screen mt-[50px]">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SideBar Toggle Button - Only show when category or brand parameters exist */}
          {shouldShowSidebar && (
            <div className="mb-6">
              <button
                onClick={handleViewSidebar}
                className="w-full px-4 py-2 text-[18px] font-medium text-white bg-[#438c71] rounded-lg hover:bg-[#3a7a5f] transition-colors"
              >
              {t('filter')}
              </button>
            </div>
          )}

          <SideBar
            isOpen={sidebarOpen}
            toggleSidebar={handleViewSidebar}
            onFilterChange={() => {}}
          />

          {/* Products Area */}
          <div className={`${shouldShowSidebar ? "lg:w-3/4" : "w-full"}`}>
            {transformedProducts.length > 0 ? (
              <ProductHelper items={transformedProducts} />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-20 h-20 mx-auto"
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
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      }
    >
      <PageContentWrapper />
    </Suspense>
  );
}

