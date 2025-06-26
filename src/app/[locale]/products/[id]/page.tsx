"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import ProductImage from "../ProductImage";
import { getProductById } from "@/lib/actions/actions";
import SimilarProducts from "@/components/SimilarProducts";

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

const Page = (props: { params: { id: string; locale: string } }) => {
  const { id, locale } = props.params;
  const t = useTranslations('productDetail');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        // Convert the data to match the Product interface
        if (data) {
          const productWithDecimalPrices = {
            ...data,
            sizes: data.sizes?.map(size => ({
              ...size,
              price: new SimpleDecimal(size.price.toString())
            })) || undefined,
            sales: data.sales || undefined
          };
          setProduct(productWithDecimalPrices as Product);
          // Set the first size as default selected
          if (data.sizes && Array.isArray(data.sizes) && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getSelectedSizeData = () => {
    if (!product || !selectedSize || !product.sizes) return null;
    return product.sizes.find(size => size.id === selectedSize);
  };

  const formatSizeDisplay = (sizeEnum: string) => {
    // Convert SIZE_80_190 to 80-190 format
    return sizeEnum.replace('SIZE_', '').replace('_', '-');
  };

  // Get localized title and description based on locale
  const getLocalizedTitle = () => {
    return locale === 'en' ? product?.titleEn || product?.title : product?.title || product?.titleEn;
  };

  const getLocalizedDescription = () => {
    return locale === 'en' ? product?.descriptionEn || product?.description : product?.description || product?.descriptionEn;
  };

  // Fallback translations for debugging
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-lg font-semibold mt-20">{getTranslation('product.productNotFound', 'Product not found')}</div>
    );
  }
  
  const selectedSizeData = getSelectedSizeData();
  const hasNewStructure = product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0;
  const localizedTitle = getLocalizedTitle();
  const localizedDescription = getLocalizedDescription();
  
  return (
    <>


     
      <div className="py-2 mt-[120px] min-h-screen mx-auto md:py-4 ">
        <div className="container mx-auto">
          <div className="grid max-w-7xl mx-auto grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start">
            
            {/* Product Images */}
            <div className="w-full">
              <ProductImage image={product.images} />
            </div>

            {/* Product Details */}
            <div className="space-y-3 lg:max-w-md">
              {/* Product Title */}
              <div className="pb-2">
                <h1 className="text-[18px]  font-semibold text-gray-900 mb-2 leading-tight">
                  {localizedTitle}
                </h1>
                
                <p className="text-[18px] text-gray-600 mb-1">
                  {getTranslation('product.brand', 'Brand')}: <span className="font-medium text-gray-900">{product.brand}</span>
                </p>

                <p className="text-[18px] text-gray-600">
                  {getTranslation('product.category', 'Category')}: <span className="font-medium text-gray-900">{product.category}</span>
                </p>
              </div>

              {/* Size Selection */}
              {hasNewStructure && (
                <div className="pb-2">
                  <div className="flex items-center gap-3">
                  <h3 className="text-[18px] font-semibold gap-4 text-gray-900 ">{getTranslation('product.size', 'Size')}:  </h3>
                    {product.sizes?.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size.id)}
                        className={`px-3  py-1 rounded-full text-[18px] font-semibold transition-all duration-300 transform hover:scale-105 ${
                          selectedSize === size.id
                            ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25"
                            : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200"
                        }`}
                      >
                        {formatSizeDisplay(size.size)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Display */}
              {selectedSizeData && (
                <div className="pb-2">
                  <div className="flex items-start gap-3">
                    <span className="text-[18px] text-gray-600">{getTranslation('product.price', 'Price')}  {Number(selectedSizeData.price.toNumber())} ₾</span>
                
                  
                  </div>
                </div>
              )}

              {/* Product Description */}
              <div className="pb-2">
                <h3 className="text-[18px] sm:text-[16px] font-semibold text-gray-900 mb-2">{getTranslation('product.description', 'Description')}</h3>
                <p className="text-[18px] sm:text-[16px] leading-relaxed text-gray-700 line-clamp-3">
                  {localizedDescription || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid, hic. Dolores commodi nulla, assumenda sit nostrum voluptatem eveniet, velit odio tempora placeat hic. Veniam dolorum totam earum vitae nesciunt voluptatum."}
                </p>
              </div>

              {/* Availability */}
              <div className="pb-2">
                <h3 className="text-[15px] md:text-[18px] sm:text-base font-semibold text-gray-900 mb-2">{getTranslation('product.availability', 'Availability')}</h3>
                <div className="space-y-1">
                  {product?.tbilisi && (
                    <div className="flex items-center justify-between p-2 bg-[#f8f5f0] rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm md:text-[18px] font-medium text-gray-900">{getTranslation('locations.tbilisi', 'Tbilisi')}</span>
                      </div>
                      <span className=" text-sm md:text-[18px] text-gray-600">{getTranslation('locations.tbilisiAddress', 'Tbilisi, T. Eristavi 1')}</span>
                    </div>
                  )}

                  {product?.batumi && (
                    <div className="flex items-center justify-between p-2 bg-[#f8f5f0] rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm md:text-[18px] sm:text-base font-medium text-gray-900">{getTranslation('locations.batumi', 'Batumi')}</span>
                      </div>
                      <span className="text-sm md:text-[18px] text-gray-600">{getTranslation('locations.batumiAddress', 'Batumi, A. Pushkin 117')}</span>
                    </div>
                  )}

                  {product?.qutaisi && (
                    <div className="flex items-center justify-between p-2 bg-[#f8f5f0] rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm md:text-[18px] font-medium text-gray-900">{getTranslation('locations.qutaisi', 'Kutaisi')}</span>
                      </div>
                      <span className="text-sm md:text-[18px] text-gray-600">{getTranslation('locations.qutaisiAddress', 'Kutaisi, Z. Purtzeladze 15')}</span>
                    </div>
                  )}

                  {!product?.tbilisi && !product?.batumi && !product?.qutaisi && (
                    <div className="flex items-center justify-center p-2 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-[18px] sm:text-base text-red-700 font-medium">{getTranslation('product.outOfStock', 'Out of stock at all locations')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="pt-1">
                <button 
                  className={`px-4 py-2 rounded-full text-[18px] font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedSize
                      ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25 hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!selectedSize}
                >
                  <span>{getTranslation('product.addToCart', 'Add to Cart')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
      <SimilarProducts currentProductId={id} category={product.category} />
      </div>
    </>
  );
};

export default Page;
