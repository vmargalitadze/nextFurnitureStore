"use client";

import Image from "next/image";
import {
  useParams,
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import React, { Suspense, useState, useEffect, useRef } from "react";

import ProductHelper from "@/components/ProductHelper";
import { getAllProducts } from "@/lib/actions/actions";
import { useTranslations } from "next-intl";
import SideBar from "@/components/Sidebar";
import ListSideBar from "@/components/ListSidebar";
import Pagination from "@/components/Pagination";
import { Trash2 } from "lucide-react";
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
  searchQuery?: string;
}

function PageContentWrapper() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listSidebarOpen, setListSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const t = useTranslations("common");
  
  const [selectedType, setSelectedType] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Show 12 products per page

  // Handle filter changes from ListSidebar
  const handleListFilterChange = (filters: FilterState) => {
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
        !filters.searchQuery ||
        product.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        product.titleEn.toLowerCase().includes(filters.searchQuery.toLowerCase());

      // Price range filter
      const priceRange = getProductPriceRange(product);
      const matchesPrice =
        priceRange.min >= filters.priceRange.min &&
        priceRange.max <= filters.priceRange.max;

      return matchesCategory && matchesBrand && matchesQuery && matchesPrice;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleViewListSidebar = () => {
    setListSidebarOpen(!listSidebarOpen);
  };

  const [selectedPrice, setSelectedPrice] = useState<{
    min: number | null;
    max: number | null;
  }>({ min: null, max: null });
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const params = useParams();
  const router = useRouter();
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
  const sidebarRef = useRef<{ clearFilters: () => void } | null>(null);
  const handleClearFilters = () => {
    // Reset local filter states
    setSelectedType("");
    setSelectedPrice({ min: null, max: null });
    setSelectedBrand("");
    setSelectedSize("");
    setSortBy("newest");

    // Show all products
    setFilteredProducts(products);

    // Clear query parameters from URL
    router.push(`/${locale}/list`);

    // Call sidebar clearFilters method (removes filters visually/sidebar state)
    sidebarRef.current?.clearFilters();
  };
  const locale = params.locale as string;
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedType) count++;
    if (selectedSize) count++;
    if (selectedBrand) count++;
    if (selectedPrice.min !== null) count++;
    if (selectedPrice.max !== null) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();
  const getLocalizedTitle = (product: Product): string => {
    if (locale === "en") {
      return product.titleEn ?? product.title;
    }
    return product.title ?? product.titleEn ?? "";
  };
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPriceRange = getProductPriceRange(a);
    const bPriceRange = getProductPriceRange(b);

    console.log('Sorting by:', sortBy); // Debug log

    switch (sortBy) {
      case "price-low":
        return aPriceRange.min - bPriceRange.min;
      case "price-high":
        return bPriceRange.max - aPriceRange.max;
      case "name":
        // Use localized titles for sorting
        const aTitle = getLocalizedTitle(a);
        const bTitle = getLocalizedTitle(b);
        return aTitle.localeCompare(bTitle);
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Update URL with page parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Update current page when URL changes
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const page = pageParam ? parseInt(pageParam) : 1;
    setCurrentPage(page);
  }, [searchParams]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  // Get URL parameters
  const category = searchParams.get("cat");
  const brand = searchParams.get("brand");
  const query = searchParams.get("query") || "";

  // Check if sidebar should be shown (only when category or brand parameters exist)
  const shouldShowSidebar = Boolean(category || brand);

  const handleViewSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const pathname = usePathname();

  const isListPage = pathname?.includes("/list");

  const hasQueryParams = Array.from(searchParams.keys()).length > 0;

  const isListPage1 = pathname.endsWith("/list") && !hasQueryParams;
  // Transform database products to match ProductHelper interface
  const transformedProducts = currentProducts.map((product) => {
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
          <h2 className="text-primary text-xl md:text-[45px] font-normal leading-none text-center capitalize">
            {getPageTitle()}
          </h2>
          {filteredProducts.length > 0 && (
            <p className="text-white mt-2 text-[18px]">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} found
              {totalPages > 1 && (
                <span className="block text-sm opacity-90">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length}
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="container min-h-screen mt-[50px]">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              <div>
                <p className="text-gray-600 text-sm">
                  {t("found")}{" "}
                  <span className="font-bold text-gray-900 text-lg">
                    {sortedProducts.length}
                  </span>{" "}
                  {t("products")}
                  {totalPages > 1 && (
                    <span className="text-gray-500 ml-2">
                      (Page {currentPage} of {totalPages})
                    </span>
                  )}
                </p>

                {activeFiltersCount > 0 && (
                  <p className="text-primary text-sm font-medium">
                    {activeFiltersCount} {t("activeFilters")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4h18M3 8h18M3 12h18M3 16h18"
                  />
                </svg>
                <label className="text-sm font-medium text-gray-700">
                  {t("sortBy")}
                </label>
              </div>
              <select
                value={sortBy}
                onChange={(e) => {
                  console.log('Sort changed to:', e.target.value); // Debug log
                  setSortBy(e.target.value);
                }}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white font-medium"
              >
                <option value="newest">{t("newest")}</option>
                <option value="price-low">{t("priceLowToHigh")}</option>
                <option value="price-high">{t("priceHighToLow")}</option>
                <option value="name">{t("nameAZ")}</option>
              </select>

              { shouldShowSidebar && (
              <button
                onClick={handleClearFilters}
                className="w-full px-4 py-2 text-sm font-medium border border-[#438c71] text-[#438c71] rounded-lg hover:bg-[#438c71] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
              <Trash2 size={16} />   {t("clearFilters")}
              </button>

              )}

            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {isListPage && isListPage1 && (
            <div className="mb-6">
              <button
                onClick={handleViewListSidebar}
                className="w-full px-4 py-2 text-[20px] font-bold text-white bg-[#438c71] rounded-lg hover:bg-[#3a7a5f] transition-colors"
              >
                {t("filter")}
              </button>
            </div>
          )}
          <ListSideBar 
            isOpen={listSidebarOpen} 
            toggleSidebar={handleViewListSidebar}
            onFilterChange={handleListFilterChange}
          />
          {/* SideBar Toggle Button - Only show when category or brand parameters exist */}
          {shouldShowSidebar && (
            <>
              <div className="mb-6">
                <button
                  onClick={handleViewSidebar}
                  className="w-full px-4 py-2 text-[20px] font-bold text-white bg-[#438c71] rounded-lg hover:bg-[#3a7a5f] transition-colors"
                >
                  {t("filter")}
                </button>
              </div>

              <SideBar
                isOpen={sidebarOpen}
                toggleSidebar={handleViewSidebar}
                onFilterChange={() => {}}
                ref={sidebarRef}
              />
            </>
          )}


          {/* Products Area */}
          <div className={`${shouldShowSidebar ? "lg:w-3/4" : "w-full"}`}>
            {transformedProducts.length > 0 ? (
              <>
                <ProductHelper items={transformedProducts} />
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination pageCount={totalPages} />
                  </div>
                )}
              </>
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
