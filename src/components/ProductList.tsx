/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import ProductHelper from "./ProductHelper";
import { useTranslations } from "next-intl";
import { getAllProducts } from "@/lib/actions/actions";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

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
  size?: string;
  price?: SimpleDecimal;
  sales?: number;
}

interface ProductItem {
  id: string;
  image: string[];
  price: number;
  originalPrice?: number;
  sales?: number;
  title: string;
  titleEn?: string;
}

interface ProductListProps {
  selectedType?: string;
  selectedBrand?: string;
  selectedPrice?: { min: number | null; max: number | null };
}

function ProductList({
  selectedType = "",
  selectedBrand = "",
  selectedPrice = { min: null, max: null },
}: ProductListProps) {
  const t = useTranslations("productList");
  const params = useParams();
  const locale = params.locale as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // New filter state for FilterSidebar
  const [filterState, setFilterState] = useState({
    selectedCategories: [] as string[],
    selectedBrands: [] as string[],
    priceRange: { min: 0, max: 1000 },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        // Convert the data to match the Product interface
        const productsWithDecimalPrices = data.map((product: any) => ({
          ...product,
          sizes:
            product.sizes?.map((size: any) => ({
              ...size,
              price: new SimpleDecimal(size.price),
            })) || undefined,
          price: product.price ? new SimpleDecimal(product.price) : undefined,
          sales: product.sales || undefined,
        }));
        setProducts(productsWithDecimalPrices as Product[]);
        // Set images as loaded immediately after data fetch
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error fetching products:", error);
        setImagesLoaded(true); // Still set to true to show content
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getProductPriceRange = useCallback((product: Product) => {
    if (product.sizes && product.sizes.length > 0) {
      const prices = product.sizes.map((s) => s.price.toNumber());
      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
      };
    }
    if (product.price) {
      // Handle different price types safely
      let price: number;
      if (typeof product.price === 'object' && 'toNumber' in product.price) {
        price = product.price.toNumber();
      } else if (typeof product.price === 'string' || typeof product.price === 'number') {
        price = new SimpleDecimal(product.price).toNumber();
      } else {
        price = 0;
      }
      return { min: price, max: price };
    }
    return { min: 0, max: 0 };
  }, []);

  const getLocalizedTitle = useCallback(
    (product: Product): string => {
      if (locale === "en") {
        return product.titleEn ?? product.title;
      }
      return product.title ?? product.titleEn ?? "";
    },
    [locale]
  );

  // Updated filter function to work with both old and new filter interfaces
  const getFilteredProducts = useCallback(() => {
    console.log("Filtering products:", {
      selectedType,
      selectedBrand,
      selectedPrice,
      filterState,
      totalProducts: products.length,
    });

    return products.filter((product) => {
    
      const byLegacyType =
        !selectedType ||
        product.category.toLowerCase() === selectedType.toLowerCase();
      
      // Handle brand filtering for OTHERS products (they don't have brands)
      const byLegacyBrand = !selectedBrand || 
        (product.category === "OTHERS" ? true : product.brand === selectedBrand);
      
      const priceRange = getProductPriceRange(product);
      const byLegacyMinPrice =
        selectedPrice.min === null || priceRange.max >= selectedPrice.min;
      const byLegacyMaxPrice =
        selectedPrice.max === null || priceRange.min <= selectedPrice.max;

      // New filter support
      const byNewType =
        filterState.selectedCategories.length === 0 ||
        filterState.selectedCategories.includes(product.category);
      
      // Handle brand filtering for OTHERS products in new filter system
      const byNewBrand =
        filterState.selectedBrands.length === 0 ||
        (product.category === "OTHERS" ? true : filterState.selectedBrands.includes(product.brand));
      
      const byNewMinPrice = priceRange.max >= filterState.priceRange.min;
      const byNewMaxPrice = priceRange.min <= filterState.priceRange.max;

      console.log("Product filtering:", {
        productId: product.id,
        productCategory: product.category,
        byLegacyType,
        byLegacyBrand,
        byLegacyMinPrice,
        byLegacyMaxPrice,
        byNewType,
        byNewBrand,
        byNewMinPrice,
        byNewMaxPrice,
      });

      return (
        byLegacyType &&
        byLegacyBrand &&
        byLegacyMinPrice &&
        byLegacyMaxPrice &&
        byNewType &&
        byNewBrand &&
        byNewMinPrice &&
        byNewMaxPrice
      );
    });
  }, [
    products,
    selectedType,
    selectedBrand,
    selectedPrice,
    filterState,
    getProductPriceRange,
  ]);

  const filteredProducts = useMemo(() => {
    const filtered = getFilteredProducts();

    // console.log('All available categories:', Array.from(new Set(products.map(p => p.category))));

    const matress = filtered.filter((p) => p.category === "MATTRESS");

    return matress.slice(0, 5);
  }, [getFilteredProducts, products]);

  const filteredProducts2 = useMemo(() => {
    const popular = products.filter((p) => p.popular === true);
    return popular.slice(0, 5);
  }, [products]);
  
  const filteredProducts3 = useMemo(() => {
    const salesProducts = products.filter((p) => p.sales && p.sales > 0);
    return salesProducts.slice(0, 5);
  }, [products]);

  const transformProducts = useCallback(
    (products: Product[]) => {
      return products.map((product) => {
        const priceRange = getProductPriceRange(product);
        const originalPrice = priceRange.min;
        const salesPercentage = product.sales || 0;
        const discountedPrice = salesPercentage > 0 
          ? originalPrice * (1 - salesPercentage / 100) 
          : originalPrice;
        
        return {
          id: product.id,
          image: product.images,
          price: discountedPrice,
          originalPrice: salesPercentage > 0 ? originalPrice : undefined,
          sales: salesPercentage > 0 ? salesPercentage : undefined,
          title: getLocalizedTitle(product),
          titleEn: product.titleEn,
        };
      });
    },
    [getProductPriceRange, getLocalizedTitle]
  );

  const transformedProducts = useMemo(
    () => transformProducts(filteredProducts),
    [filteredProducts, transformProducts]
  );

  const transformedProducts2 = useMemo(
    () => transformProducts(filteredProducts2),
    [filteredProducts2, transformProducts]
  );
  
  const transformedProducts3 = useMemo(
    () => transformProducts(filteredProducts3),
    [filteredProducts3, transformProducts]
  );

  return (
    <section className=" px-5 md:px-20 from-gray-50 via-white to-gray-50">
      <div className="container mx-auto ">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}

          {/* Swiper Product Slider */}
          {loading || !imagesLoaded ? (
            // Skeleton Loading State
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="animate-pulse">
                    {/* Skeleton Image */}
                    <div className="w-full h-[192px] bg-gray-200 rounded-3xl mb-3"></div>
                    {/* Skeleton Title */}
                    <div className="w-[70%] h-4 bg-gray-200 rounded mb-2 mx-auto"></div>
                    {/* Skeleton Price */}
                    <div className="w-[40%] h-6 bg-gray-200 rounded mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
            {transformedProducts.length > 0 && (
              <div className="w-full rounded-2xl pt-10 ">
                <h1 className=" text-3xl md:text-[45px] mb-3  flex justify-center items-center font-light text-gray-900 leading-tight">
                  {t("newProducts")}
                </h1>
                <ProductHelper items={transformedProducts} />
              </div>
            )}
            
            <div className="w-full rounded-2xl pt-10 ">
              <h1 className=" text-3xl md:text-[45px] mb-3  flex justify-center items-center font-light text-gray-900 leading-tight">
                {t("popularProducts")}
              </h1>
              {transformedProducts2.length > 0 ? (
                <ProductHelper items={transformedProducts2} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">
                    {locale === "en" ? "No popular products available at the moment." : "ამ მომენტში პოპულარული პროდუქტები არ არის."}
                  </p>
                </div>
              )}
            </div>
            
            <div className="w-full rounded-2xl pt-10 ">
              <h1 className=" text-3xl md:text-[45px] mb-3  flex justify-center items-center font-light text-gray-900 leading-tight">
                {t("salesProducts")}
              </h1>
              {transformedProducts3.length > 0 ? (
                <ProductHelper items={transformedProducts3} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">
                    {locale === "en" ? "No products on sale at the moment." : "ამ მომენტში ფასდაკლებული პროდუქტები არ არის."}
                  </p>
                </div>
              )}
            </div>
            
            {transformedProducts.length === 0 && transformedProducts2.length === 0 && transformedProducts3.length === 0 && (
              <div className="text-center py-4">
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
            </>
          )}

          {/* View All Button */}
        </div>
      </div>
    </section>
  );
}

export default ProductList;
