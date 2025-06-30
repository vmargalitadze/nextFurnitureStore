"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import ProductImage from "../ProductImage";
import { getProductById } from "@/lib/actions/actions";
import SimilarProducts from "@/components/SimilarProducts";
import { toast } from 'sonner';
import { useCart } from "@/lib/context/CartContext";
import { CartItem } from "@/lib/types";
import { useSession } from "next-auth/react";

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
  price?: SimpleDecimal; // For OTHERS category products
  sales?: number;
}

const Page = (props: { params: { id: string; locale: string } }) => {
  const { id, locale } = props.params;
  const t = useTranslations("productDetail");
  const { addToCartOptimistic, refreshCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const { data: session } = useSession();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        // Convert the data to match the Product interface
        if (data) {
          const productWithDecimalPrices = {
            ...data,
            sizes:
              data.sizes?.map((size) => ({
                ...size,
                price: new SimpleDecimal(size.price.toString()),
              })) || undefined,
            price: data.price ? new SimpleDecimal(data.price.toString()) : undefined,
            sales: data.sales || undefined,
          };
          setProduct(productWithDecimalPrices as Product);
          // Set the first size as default selected for products with sizes
          if (
            data.sizes &&
            Array.isArray(data.sizes) &&
            data.sizes.length > 0
          ) {
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
    return product.sizes.find((size) => size.id === selectedSize);
  };

  const isOthersProduct = () => {
    return product?.category === "OTHERS";
  };

  const getProductPrice = () => {
    if (isOthersProduct() && product?.price) {
      return product.price.toNumber();
    }
    if (selectedSizeData) {
      return selectedSizeData.price.toNumber();
    }
    return 0;
  };

  const getDiscountedPrice = () => {
    const basePrice = getProductPrice();
    if (product?.sales && product.sales > 0) {
      return basePrice * (1 - product.sales / 100);
    }
    return basePrice;
  };

  const formatSizeDisplay = (sizeEnum: string) => {
    // Convert SIZE_80_190 to 80-190 format
    return sizeEnum.replace("SIZE_", "").replace("_", "-");
  };

  // Get localized title and description based on locale
  const getLocalizedTitle = () => {
    return locale === "en"
      ? product?.titleEn || product?.title
      : product?.title || product?.titleEn;
  };

  const getLocalizedDescription = () => {
    return locale === "en"
      ? product?.descriptionEn || product?.description
      : product?.description || product?.descriptionEn;
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

  const handleAddToCart = async () => {
    if (!product) return;

    // For OTHERS products, no size selection needed
    if (isOthersProduct()) {
      if (!product.price) {
        toast.error('Product price not available');
        return;
      }
    } else {
      // For sized products, size selection is required
      if (!selectedSize) {
        toast.error('Please select a size');
        return;
      }
    }

    const selectedSizeData = getSelectedSizeData();
    const basePrice = getProductPrice();
    const finalPrice = getDiscountedPrice();

    // Show toast immediately for better UX
    toast.success('Added to cart successfully!');

    // Optimistically update the cart UI
    const newItem: CartItem = {
      productId: product.id,
      name: getLocalizedTitle() || product.title || 'Product',
      size: isOthersProduct() ? 'N/A' : (selectedSizeData?.size || ''),
      qty: 1,
      image: product.images[0],
      price: finalPrice.toFixed(2),
    };
    
    addToCartOptimistic(newItem);

    setAddingToCart(true);
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          size: isOthersProduct() ? 'N/A' : (selectedSizeData?.size || ''),
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      // Refresh cart to get the actual server state
      await refreshCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
      // Refresh cart to revert optimistic update on error
      await refreshCart();
    } finally {
      setAddingToCart(false);
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
      <div className="text-center text-lg font-semibold mt-20">
        {getTranslation("product.productNotFound", "Product not found")}
      </div>
    );
  }

  const selectedSizeData = getSelectedSizeData();
  const hasNewStructure =
    product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0;
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
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-[18px] font-semibold text-gray-900 leading-tight">
                    {localizedTitle}
                  </h1>
                  {product.sales && product.sales > 0 && (
                    <span className="text-xs text-white font-bold bg-red-500 px-2 py-1 rounded-full">
                      -{product.sales}% SALE
                    </span>
                  )}
                </div>

                {/* Brand - only show for non-OTHERS products */}
                {!isOthersProduct() && product.brand && (
                  <p className="text-[18px] font-bold text-gray-600 mb-1">
                    {getTranslation("product.brand", "Brand")}:{" "}
                    <span className="font-medium text-gray-900">
                      {product.brand}
                    </span>
                  </p>
                )}

                <p className="text-[18px] font-bold text-gray-600">
                  {getTranslation("product.category", "Category")}:{" "}
                  <span className="font-medium text-gray-900">
                    {product.category}
                  </span>
                </p>
              </div>

              {/* Size Selection - Only for non-OTHERS products */}
              {!isOthersProduct() && hasNewStructure && (
                <div className="pb-2">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[18px] font-semibold text-gray-900">
                      {getTranslation("product.size", "Size")}:
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {product.sizes?.map((size) => {
                        const sizePrice = size.price.toNumber();
                        const discountedPrice = product.sales && product.sales > 0 
                          ? sizePrice * (1 - product.sales / 100)
                          : sizePrice;
                        
                        return (
                          <button
                            key={size.id}
                            onClick={() => setSelectedSize(size.id)}
                            className={`p-3 text-left rounded-lg transition-all duration-200 border-2 ${
                              selectedSize === size.id
                                ? "border-[#438c71] bg-[#438c71] text-white shadow-lg scale-105"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="font-bold text-[16px]">
                              {formatSizeDisplay(size.size)}
                            </div>
                            <div className={`text-sm ${selectedSize === size.id ? 'text-white' : 'text-gray-600'}`}>
                              {product.sales && product.sales > 0 ? (
                                <div>
                                  <span className="line-through">₾{sizePrice.toFixed(2)}</span>
                                  <span className="ml-2 font-bold">₾{discountedPrice.toFixed(2)}</span>
                                </div>
                              ) : (
                                <span className="font-bold">₾{sizePrice.toFixed(2)}</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Price Display - Only for OTHERS products */}
              {isOthersProduct() && product.price && (
                <div className="pb-2">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[18px] font-semibold text-gray-900">
                      {getTranslation("product.price", "Price")}:
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-center">
                        {product.sales && product.sales > 0 ? (
                          <div>
                            <div className="text-sm text-gray-500 line-through">
                              ₾{product.price.toNumber().toFixed(2)}
                            </div>
                            <div className="text-2xl font-bold text-[#438c71]">
                              ₾{getDiscountedPrice().toFixed(2)}
                            </div>
                            <div className="text-sm text-red-600 font-semibold">
                              -{product.sales}% OFF
                            </div>
                          </div>
                        ) : (
                          <div className="text-2xl font-bold text-[#438c71]">
                            ₾{product.price.toNumber().toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Description */}

              {/* Availability */}
              <div className="pb-2">
                <h3 className="text-[15px] md:text-[18px] sm:text-base font-semibold text-gray-900 mb-2">
                  {getTranslation("product.availability", "Availability")}
                </h3>
                <div className="space-y-1">
                  {product?.tbilisi && (
                    <div className="flex items-center justify-between p-2 bg-[#f8f5f0] rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm md:text-[18px] font-medium text-gray-900">
                          {getTranslation("locations.tbilisi", "Tbilisi")}
                        </span>
                      </div>
                      <span className=" text-sm md:text-[18px] text-gray-600">
                        {getTranslation(
                          "locations.tbilisiAddress",
                          "Tbilisi, T. Eristavi 1"
                        )}
                      </span>
                    </div>
                  )}

                  {product?.batumi && (
                    <div className="flex items-center justify-between p-2 bg-[#f8f5f0] rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm md:text-[18px] sm:text-base font-medium text-gray-900">
                          {getTranslation("locations.batumi", "Batumi")}
                        </span>
                      </div>
                      <span className="text-sm md:text-[18px] text-gray-600">
                        {getTranslation(
                          "locations.batumiAddress",
                          "Batumi, A. Pushkin 117"
                        )}
                      </span>
                    </div>
                  )}

                  {product?.qutaisi && (
                    <div className="flex items-center justify-between p-2 bg-[#f8f5f0] rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm md:text-[18px] font-medium text-gray-900">
                          {getTranslation("locations.qutaisi", "Kutaisi")}
                        </span>
                      </div>
                      <span className="text-sm md:text-[18px] text-gray-600">
                        {getTranslation(
                          "locations.qutaisiAddress",
                          "Kutaisi, Z. Purtzeladze 15"
                        )}
                      </span>
                    </div>
                  )}

                  {!product?.tbilisi &&
                    !product?.batumi &&
                    !product?.qutaisi && (
                      <div className="flex items-center justify-center p-2 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                          <span className="text-[18px] sm:text-base text-red-700 font-medium">
                            {getTranslation(
                              "product.outOfStock",
                              "Out of stock at all locations"
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Add to Cart Button */}
              {session && (
              <div className="pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={(!isOthersProduct() && !selectedSize) || addingToCart}
                  className={`w-[50%] px-4 py-2 text-[15px] md:text-[20px] font-bold text-white bg-[#438c71] rounded-lg hover:bg-[#3a7a5f] transition-colors ${
                    (isOthersProduct() || selectedSize) && !addingToCart
                      ? "bg-[#438c71] text-white"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  <span>
                    {addingToCart 
                      ? "Adding..." 
                      : getTranslation("product.addToCart", "Add to Cart")
                    }
                  </span>
                </button>
              </div>
              )}
              {!session && (
                <div className="pt-1">
                  <button className="w-full px-4 mb-10 py-2 text-[20px] font-bold text-white bg-[#438c71] rounded-lg hover:bg-[#3a7a5f] transition-colors">
                    <Link href="/sign-in">Login to add to cart</Link>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="container mx-auto mt-10">
            <div className="max-w-7xl mx-auto">
              <div className="pb-2">
                <h3 className="text-[20px] text-center sm:text-[20px] font-semibold text-gray-900 mb-2">
                  {getTranslation("product.description", "Description")}
                </h3>
                <p className="text-[18px] sm:text-[16px] leading-relaxed text-gray-700  md:line-clamp-none">
                  {localizedDescription}
                </p>
              </div>
        <SimilarProducts currentProductId={id} category={product.category} />
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Page;
