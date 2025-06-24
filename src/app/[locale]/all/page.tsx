"use client";

import { Link } from "@/i18n/navigation";
import React, { useState, Suspense, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams, useParams } from 'next/navigation';
import ProductHelper from '@/components/ProductHelper';
import Filter from '@/components/Filter';
import Pagination from '@/components/Pagination';
import { getAllProducts } from "@/lib/actions/actions";
import { useTranslations } from "next-intl";

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

const PRODUCT_PER_PAGE = 12;

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
}

function PageContent() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('allPage');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  const query = searchParams.get("query") || "";
  const pageParam = searchParams.get("page") || "1";
  const currentPage = Number(pageParam);

  // Calculate active filters count
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

  // Helper function to get product price range
  const getProductPriceRange = (product: Product) => {
    if (product.sizes && product.sizes.length > 0) {
      const prices = product.sizes.map(s => s.price.toNumber());
      return {
        min: Math.min(...prices),
        max: Math.max(...prices)
      };
    }
    // Fallback to old structure
    if (product.price) {
      const price = product.price.toNumber();
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
      // Convert price strings to Decimal before setting products
      const productsWithDecimalPrices = data.map(product => ({
        ...product,
        sizes: product.sizes.map(size => ({
          ...size,
          price: new SimpleDecimal(size.price)
        }))
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

  const categories = Array.from(new Set(products.map(p => p.category)));

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
            <h1 className="text-primary text-xl md:text-5xl font-bold leading-tight text-center mb-4">
              {t('hero.title')}
            </h1>
           
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
          <h1 className=" text-xl text-primary md:text-5xl font-bold leading-tight text-center mb-4">
            {t('hero.title')}
          </h1>
         
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button - Only visible on small screens */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-lg hover:shadow-xl transition-all duration-200 hover:border-gray-300"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <span className="font-semibold text-gray-900">
                  {t('filters.title')}
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                      {activeFiltersCount}
                    </span>
                  )}
                </span>
              </div>
              <svg 
                className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Mobile Filter Panel - Collapsible on small screens */}
          <div className={`lg:hidden ${filterOpen ? 'block' : 'hidden'} mb-6`}>
            <Filter
              open={filterOpen}
              setOpen={setFilterOpen}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selectedPrice={selectedPrice}
              setSelectedPrice={setSelectedPrice}
              categories={categories}
            />
          </div>

          {/* Desktop Sidebar Filter - Only visible on large screens */}
          <div className="hidden lg:block lg:w-1/4">
            <Filter
              open={true}
              setOpen={() => {}}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selectedPrice={selectedPrice}
              setSelectedPrice={setSelectedPrice}
              categories={categories}
            />
          </div>

          {/* Main Product Area */}
          <div className="lg:w-3/4">
            {/* Header with results and sort */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-gray-600 text-sm">
                      {t('results.found')} <span className="font-bold text-gray-900 text-lg">{sortedProducts.length}</span> {t('results.products')}
                    </p>
                    {activeFiltersCount > 0 && (
                      <p className="text-primary text-sm font-medium">
                        {activeFiltersCount} {t('filters.activeFilters')}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M3 8h18M3 12h18M3 16h18" />
                    </svg>
                    <label className="text-sm font-medium text-gray-700">
                      {t('sorting.sortBy')}
                    </label>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white font-medium"
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
            </div>

            {/* Products Grid using ProductHelper */}
            {transformedProducts.length > 0 ? (
              <ProductHelper items={transformedProducts} />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <div className="text-gray-400 mb-6">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('results.noProductsFound')}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {t('results.tryDifferentFilters')}
                </p>
                <button
                  onClick={() => {
                    setSelectedType("");
                    setSelectedPrice({ min: null, max: null });
                    setSelectedBrand("");
                    setSelectedSize("");
                  }}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-200"
                >
                  {t('filters.clearFilters')}
                </button>
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
