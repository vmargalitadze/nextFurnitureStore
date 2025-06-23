"use client";
import React, { useState, useEffect } from "react";
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
  title: string;
  titleEn?: string;
}

interface ProductListProps {
  selectedType: string;
  selectedBrand: string;
  selectedPrice: { min: number | null; max: number | null };
}

function ProductList({ selectedType, selectedBrand, selectedPrice }: ProductListProps) {
  const t = useTranslations("productList");
  const params = useParams();
  const locale = params.locale as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        // Convert the data to match the Product interface
        const productsWithDecimalPrices = data.map(product => ({
          ...product,
          sizes: product.sizes?.map(size => ({
            ...size,
            price: new SimpleDecimal(size.price)
          })) || undefined,
          sales: product.sales || undefined
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

  const getProductPriceRange = (product: Product) => {
    if (product.sizes && product.sizes.length > 0) {
      const prices = product.sizes.map((s) => s.price.toNumber());
      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
      };
    }
    if (product.price) {
      const price = product.price.toNumber();
      return { min: price, max: price };
    }
    return { min: 0, max: 0 };
  };

  const getLocalizedTitle = (product: Product): string => {
    if (locale === "en") {
      return product.titleEn ?? product.title;
    }
    return product.title ?? product.titleEn ?? "";
  };

  // Filter products based on sidebar filter props
  const getFilteredProducts = () => {
    console.log('Filtering products:', {
      selectedType,
      selectedBrand,
      selectedPrice,
      totalProducts: products.length
    });
    
    return products.filter(product => {
      const byType = !selectedType || product.category.toLowerCase() === selectedType.toLowerCase();
      const byBrand = !selectedBrand || product.brand === selectedBrand;
      const priceRange = getProductPriceRange(product);
      const byMinPrice = selectedPrice.min === null || priceRange.max >= selectedPrice.min;
      const byMaxPrice = selectedPrice.max === null || priceRange.min <= selectedPrice.max;
      
      console.log('Product filtering:', {
        productId: product.id,
        productCategory: product.category,
        selectedType,
        byType,
        byBrand,
        byMinPrice,
        byMaxPrice
      });
      
      return byType && byBrand && byMinPrice && byMaxPrice;
    });
  };

  // Show up to 12 products (to fill the Swiper)
  const filteredProducts = getFilteredProducts().slice(0, 12);

  const transformProducts = (products: Product[]) => {
    return products.map((product) => {
      const priceRange = getProductPriceRange(product);
      return {
        id: product.id,
        image: product.images,
        price: priceRange.min,
        title: getLocalizedTitle(product),
        titleEn: product.titleEn,
      };
    });
  };

  const transformedProducts = transformProducts(filteredProducts);

  return (
    <section className="bg-gradient-to-br px-5 md:px-20 from-gray-50 via-white to-gray-50">
      <div className=" ">
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
          ) : transformedProducts.length > 0 ? (
            <div className="w-full  pt-10 pb-4">
              <ProductHelper items={transformedProducts} />
            </div>
          ) : (
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

          {/* View All Button */}
          <div className="text-center mx-auto mt-7 md:mt-12">
            <Link
              className="inline-block text-xl px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25 hover:shadow-xl"
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
