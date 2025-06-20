"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import ProductImage from "../ProductImage";
import { getProductById } from "@/lib/actions/actions";
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
  // Keep old fields for backward compatibility during migration
  size?: string;
  price?: Decimal;
}

const Page = (props: { params: { id: string; locale: string } }) => {
  const { id, locale } = props.params;
  const t = useTranslations('productDetail');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data as Product);
        // Set the first size as default selected
        if (data && 'sizes' in data && Array.isArray(data.sizes) && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0].id);
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
      <div className="text-center text-lg font-bold mt-20">{getTranslation('product.productNotFound', 'Product not found')}</div>
    );
  }
  
  const selectedSizeData = getSelectedSizeData();
  const hasNewStructure = product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0;
  const localizedTitle = getLocalizedTitle();
  const localizedDescription = getLocalizedDescription();
  
  return (
    <>
      <div className="bg-[#F8F5F0] mt-[80px] py-5 md:py-[30px]">
        <div className="container mx-auto">
          <ul className="flex justify-center items-center gap-2 text-2xl md:text-lg font-normal text-black flex-wrap text-center">
            <li>
              <Link href="/" data-discover="true">
                {getTranslation('breadcrumb.home', 'Home')}
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary text-2xl">{localizedTitle}</li>
          </ul>
        </div>
      </div>
      <div className="s-py-100-50">
        <div className="container">
          <div className="mx-auto flex justify-between gap-6 lg:gap-8 flex-col lg:flex-row">
            <div className="w-full lg:w-[58%]">
              <ProductImage image={product.images} />
            </div>
            <div className="lg:max-w-[635px] w-full">
              <div className="pb-4 sm:pb-6 border-b border-bdr-clr border-bdr-clr-drk">
                <h2 className="font-semibold pb-5 text-3xl leading-none tracking-tight text-title text-black">
                  {localizedTitle}
                </h2>

                <span className="text-2xl pb-5 sm:text-3xl leading-none block">
                  {getTranslation('product.brand', 'Brand')}: {product.brand}
                </span>

                {/* Size Selection */}
                {hasNewStructure && (
                  <div className="mb-4">
                    <span className="text-lg font-medium block mb-2">{getTranslation('product.size', 'Size')}:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes?.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setSelectedSize(size.id)}
                          className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                            selectedSize === size.id
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
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
                  <span className="text-2xl pb-5 sm:text-3xl leading-none block text-primary font-semibold">
                    {getTranslation('product.price', 'Price')}: {Number(selectedSizeData.price)} ₾
                  </span>
                )}

                <span className="text-lg pb-3 leading-none block text-gray-600">
                  {getTranslation('product.category', 'Category')}: {product.category}
                </span>

                <p className="text-base pb-5 md:text-lg leading-6 font-normal text-title text-black mt-2">
                  {localizedDescription || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid, hic. Dolores commodi nulla, assumenda sit nostrum voluptatem eveniet, velit odio tempora placeat hic. Veniam dolorum totam earum vitae nesciunt voluptatum."}
                </p>
              <div className="  shadow-sm ">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{getTranslation('product.availability', 'Availability')}</h3>
                  <div className="space-y-3">
                    {product?.tbilisi && (
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">{getTranslation('locations.tbilisi', 'Tbilisi')}</span>
                        </div>
                        <span className="text-sm text-gray-600">{getTranslation('locations.tbilisiAddress', 'Tbilisi, T. Eristavi 1')}</span>
                      </div>
                    )}

                    {product?.batumi && (
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">{getTranslation('locations.batumi', 'Batumi')}</span>
                        </div>
                        <span className="text-sm text-gray-600">{getTranslation('locations.batumiAddress', 'Batumi, A. Pushkin 117')}</span>
                      </div>
                    )}

                    {product?.qutaisi && (
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">{getTranslation('locations.qutaisi', 'Kutaisi')}</span>
                        </div>
                        <span className="text-sm text-gray-600">{getTranslation('locations.qutaisiAddress', 'Kutaisi, Z. Purtzeladze 15')}</span>
                      </div>
                    )}

                    {!product?.tbilisi && !product?.batumi && !product?.qutaisi && (
                      <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span className="text-red-700 font-medium">{getTranslation('product.outOfStock', 'Out of stock at all locations')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

                    
              <div className="py-5 sm:py-6">
                <div className="flex gap-5 mt-4 sm:mt-6">
                  <button 
                    className="btn-all text-black btn-outline"
                    disabled={!selectedSize}
                  >
                    <span>{getTranslation('product.addToCart', 'Add to Cart')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
