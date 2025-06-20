"use client";

import { Link } from "@/i18n/navigation";
import React, { useState, Suspense, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams, useParams } from 'next/navigation';
import ProductHelper from '@/components/ProductHelper';
import Filter from '@/components/Filter';
import Pagination from '@/components/Pagination';
import { Decimal } from "@prisma/client/runtime/library";
import { getAllProducts } from "@/lib/actions/actions";
import { useTranslations } from "next-intl";

const PRODUCT_PER_PAGE = 12;

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
  // Keep old fields for backward compatibility during migration
  size?: string;
  price?: Decimal;
}

function PageContent() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('allPage');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  const query = searchParams.get("query") || "";
  const pageParam = searchParams.get("page") || "1";
  const currentPage = Number(pageParam);

  // Helper function to get product price range
  const getProductPriceRange = (product: Product) => {
    if (product.sizes && product.sizes.length > 0) {
      const prices = product.sizes.map(s => Number(s.price));
      return {
        min: Math.min(...prices),
        max: Math.max(...prices)
      };
    }
    // Fallback to old structure
    if (product.price) {
      const price = Number(product.price);
      return { min: price, max: price };
    }
    return { min: 0, max: 0 };
  };

  // Get localized title based on locale
  const getLocalizedTitle = (product: Product): string => {
    if (locale === 'en') {
      return product.titleEn ?? product.title;
    }
    return product.title ?? product.titleEn ?? '';
  };

  // Helper function to check if product has specific size
  const hasProductSize = (product: Product, sizeFilter: string) => {
    if (!sizeFilter) return true;
    
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes.some(s => s.size === sizeFilter);
    }
    // Fallback to old structure
    return product.size === sizeFilter;
  };

  const filteredProducts = products.filter((product) => {
    const byBrand = !selectedBrand || product.brand === selectedBrand;
    const byType = !selectedType || product.category === selectedType;
    const bySize = hasProductSize(product, selectedSize);
    
    const priceRange = getProductPriceRange(product);
    const byMinPrice = selectedPrice.min === null || priceRange.max >= selectedPrice.min;
    const byMaxPrice = selectedPrice.max === null || priceRange.min <= selectedPrice.max;
    
    // Use localized title for search
    const localizedTitle = getLocalizedTitle(product);
    const byQuery = !query || localizedTitle.toLowerCase().includes(query.toLowerCase());
    
    return byBrand && byType && bySize && byMinPrice && byMaxPrice && byQuery;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPriceRange = getProductPriceRange(a);
    const bPriceRange = getProductPriceRange(b);
    
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

  const pageCount = Math.ceil(sortedProducts.length / PRODUCT_PER_PAGE);
  const currentPageProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCT_PER_PAGE,
    currentPage * PRODUCT_PER_PAGE
  );

  // Transform database products to match ProductHelper interface
  const transformedProducts = currentPageProducts.map(product => {
    const priceRange = getProductPriceRange(product);
    return {
      id: product.id,
      image: product.images,
      price: priceRange.min, // Show minimum price for display
      title: getLocalizedTitle(product),
      titleEn: product.titleEn
    };
  });

  // Get all available sizes from products
  const getAllAvailableSizes = () => {
    const sizes = new Set<string>();
    products.forEach(product => {
      if (product.sizes && product.sizes.length > 0) {
        product.sizes.forEach(s => sizes.add(s.size));
      } else if (product.size) {
        sizes.add(product.size);
      }
    });
    return Array.from(sizes).sort();
  };

  // Format size display
  const formatSizeDisplay = (sizeEnum: string) => {
    return sizeEnum.replace('SIZE_', '').replace('_', '-');
  };

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

  useEffect(() => {
    fetchProducts();
  }, []);

  // Loading state
  if (loading) {
    return (
      <>
        {/* Hero Section */}
        <div className="relative min-h-[300px] flex items-center justify-center bg-overlay p-8 sm:p-12 before:bg-title before:bg-opacity-70 overflow-hidden">
          <Image
            src="/bedroom.jpg"
            alt="Background"
            fill
            quality={80}
            className="object-cover z-0"
          />
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="relative z-20 text-center w-full">
            <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight text-center mb-4">
              {t('hero.title')}
            </h1>
            <nav className="flex items-center justify-center gap-2 text-base md:text-lg text-white/80">
              <Link href="/" className="hover:text-white transition-colors">
                {t('hero.breadcrumb.home')}
              </Link>
              <span>/</span>
              <span className="text-primary font-medium">
                {t('hero.breadcrumb.products')}
              </span>
            </nav>
          </div>
        </div>

        {/* Loading Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filter Skeleton */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Product Area Loading */}
            <div className="lg:w-3/4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
              </div>

              {/* Products Grid Skeleton */}
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
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-[300px] flex items-center justify-center bg-overlay p-8 sm:p-12 before:bg-title before:bg-opacity-70 overflow-hidden">
        <Image
          src="/bedroom.jpg"
          alt="Background"
          fill
          quality={80}
          className="object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 text-center w-full">
          <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight text-center mb-4">
            {t('hero.title')}
          </h1>
          <nav className="flex items-center justify-center gap-2 text-base md:text-lg text-white/80">
            <Link href="/" className="hover:text-white transition-colors">
              {t('hero.breadcrumb.home')}
            </Link>
            <span>/</span>
            <span className="text-primary font-medium">
              {t('hero.breadcrumb.products')}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {t('filters.title')}
              </h3>
              
              {/* Categories */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  {t('filters.categories.title')}
                </h4>
                <div className="space-y-2">
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedType === "" 
                        ? "bg-primary text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedType("")}
                  >
                    {t('filters.categories.allCategories')}
                  </button>
                  {Array.from(new Set(products.map(p => p.category))).map((type) => (
                    <button
                      key={type}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedType === type 
                          ? "bg-primary text-white" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  {t('filters.sizes.title')}
                </h4>
                <div className="space-y-2">
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedSize === "" 
                        ? "bg-primary text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedSize("")}
                  >
                    {t('filters.sizes.allSizes')}
                  </button>
                  {getAllAvailableSizes().map((size) => (
                    <button
                      key={size}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedSize === size 
                          ? "bg-primary text-white" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {formatSizeDisplay(size)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  {t('filters.priceRange.title')}
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      {t('filters.priceRange.minimumPrice')}
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={selectedPrice.min ?? ""}
                      onChange={(e) => setSelectedPrice({
                        ...selectedPrice,
                        min: e.target.value === "" ? null : Number(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      {t('filters.priceRange.maximumPrice')}
                    </label>
                    <input
                      type="number"
                      placeholder="10000"
                      value={selectedPrice.max ?? ""}
                      onChange={(e) => setSelectedPrice({
                        ...selectedPrice,
                        max: e.target.value === "" ? null : Number(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  {t('filters.brand.title')}
                </h4>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">
                    {t('filters.brand.allBrands')}
                  </option>
                  {Array.from(new Set(products.map(p => p.brand))).map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedType("");
                  setSelectedPrice({ min: null, max: null });
                  setSelectedBrand("");
                  setSelectedSize("");
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                {t('filters.clearFilters')}
              </button>
            </div>
          </div>

          {/* Main Product Area */}
          <div className="lg:w-3/4">
            {/* Header with results and sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <p className="text-gray-600">
                  {t('results.found')} <span className="font-semibold text-gray-900">{sortedProducts.length}</span> {t('results.products')}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-600">
                  {t('sorting.sortBy')}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="newest">
                    {t('sorting.newest')}
                  </option>
                  <option value="price-low">
                    {t('sorting.priceLowToHigh')}
                  </option>
                  <option value="price-high">
                    {t('sorting.priceHighToLow')}
                  </option>
                  <option value="name">
                    {t('sorting.nameAZ')}
                  </option>
                </select>
              </div>
            </div>

            {/* Products Grid using ProductHelper */}
            {transformedProducts.length > 0 ? (
              <ProductHelper items={transformedProducts} />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('results.noProductsFound')}
                </h3>
                <p className="text-gray-600">
                  {t('results.tryDifferentFilters')}
                </p>
              </div>
            )}

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="mt-12">
                <Pagination pageCount={pageCount} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Main Page component
export default function PageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <PageContent />
    </Suspense>
  );
}
