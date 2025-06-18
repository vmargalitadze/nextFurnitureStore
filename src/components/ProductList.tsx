"use client"
import React, { useState } from "react";
import Products from "@/lib/product"
import { Link } from "@/i18n/navigation";
import ProductHelper from "./ProductHelper";
import { useTranslations } from 'next-intl';

interface ProductItem {
  id: string;
  image: string;
  price: number;
  label: string;
}

interface ProductListProps {
  items: ProductItem[]; 
}

function ProductList() {
  const t = useTranslations('productList');
  const [activeCategory, setActiveCategory] = useState("new-arrival");
  
  // Filter products based on category (you can modify this logic based on your data)
  const getFilteredProducts = () => {
    switch (activeCategory) {
      case "new-arrival":
        return Products.slice(0, 4);
      case "sales":
        return Products.slice(2, 6);
      case "trending":
        return Products.slice(1, 5);
      default:
        return Products.slice(0, 4);
    }
  };

  const items = getFilteredProducts();
  
  return (
    <>
      <div className="s-py-100-50">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-[40px] md:mb-12">
            <div className="text-center mb-8">
              <span className="text-primary font-secondary font-normal text-4xl md:text-[60px] block -ml-5 -mb-3 sm:-mb-[30px] leading-normal sm:leading-normal">
                {t('title')}
              </span>
              <h6 className="font-normal  leading-none tracking-[.5em] lg:mt-6 sm:tracking-[1em] uppercase">
                {t('subtitle')}
              </h6>
            </div>
            
            {/* Category Buttons */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
              <button
                onClick={() => setActiveCategory("new-arrival")}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === "new-arrival"
                    ? "bg-primary text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t('newArrival')}
              </button>
              <button
                onClick={() => setActiveCategory("sales")}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === "sales"
                    ? "bg-primary text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t('sales')}
              </button>
              <button
                onClick={() => setActiveCategory("trending")}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === "trending"
                    ? "bg-primary text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t('trending')}
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <ProductHelper items={items} />

          {/* View All Button */}
          <div className="text-center mx-auto mt-7 md:mt-12">
            <Link
              className="btn-all btn-outline"
              href="/all"
              data-discover="true"
            >
              <span>{t('viewAll')}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductList;
