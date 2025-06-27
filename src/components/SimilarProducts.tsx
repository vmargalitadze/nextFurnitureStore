"use client";
import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { getSimilarProducts } from "@/lib/actions/actions";

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

interface SimilarProductsProps {
  currentProductId: string;
  category: string;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ currentProductId, category }) => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('productDetail');
  const locale = useLocale();

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        const data = await getSimilarProducts(currentProductId, category, 4);
        // Convert the data to match the Product interface
        const productsWithDecimalPrices = data.map((product: any) => ({
          ...product,
          sizes: product.sizes?.map((size: any) => ({
            ...size,
            price: new SimpleDecimal(size.price)
          })) || undefined,
          sales: product.sales || undefined
        }));
        setSimilarProducts(productsWithDecimalPrices as Product[]);
      } catch (error) {
        console.error("Error fetching similar products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [currentProductId, category]);

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
    if (locale === 'en') {
      return product.titleEn ?? product.title;
    }
    return product.title ?? product.titleEn ?? '';
  };

  const getTranslation = (key: string, fallback: string) => {
    try {
      const translation = t(key);
      return translation || fallback;
    } catch (error) {
      console.error(`Translation error for key ${key}:`, error);
      return fallback;
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-[45px] font-bold text-gray-900 mb-6">
            {getTranslation('similarProducts.title', 'Similar Products')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-3"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (similarProducts.length === 0) {
    return (
      <div className="mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-[45px] font-bold text-gray-900 mb-6 text-center">
            {getTranslation('similarProducts.title', 'Similar Products')}
          </h2>
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">
              {getTranslation('similarProducts.noProducts', 'No similar products found')}
            </div>
           
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {getTranslation('similarProducts.title', 'Similar Products')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarProducts.map((product) => {
            const priceRange = getProductPriceRange(product);
            const localizedTitle = getLocalizedTitle(product);
            
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <Link href={`/products/${product.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={localizedTitle}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
                      {localizedTitle}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary">
                      {priceRange.min} ₾
                    </span>
                    <Link 
                      href={`/products/${product.id}`}
                      className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      {getTranslation('similarProducts.viewDetails', 'View Details')} →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SimilarProducts; 