"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import CategoriesList from "./CategoriesList";
import ProductHelper from "./ProductHelper";
import { getAllProducts } from "@/lib/actions/actions";
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
  size?: string;
  price?: Decimal;
}

function Categories() {
  const t = useTranslations("categories");
  const locale = useLocale();
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});

  // Fetch products and calculate real quantities
  useEffect(() => {
    const fetchProductCounts = async () => {
      try {
        const products = await getAllProducts();
        const counts: Record<string, number> = {};
        
        // Initialize counts for all categories
        CategoriesList.forEach(category => {
          counts[category.type] = 0;
        });
        
        // Count products by category
        products.forEach((product: Product) => {
          const category = product.category.toLowerCase();
          if (counts.hasOwnProperty(category)) {
            counts[category]++;
          }
        });
        
        setProductCounts(counts);
      } catch (error) {
        console.error("Error fetching product counts:", error);
      }
    };

    fetchProductCounts();
  }, []);

  // Transform categories to match ProductHelper interface
  const transformCategoriesToProducts = () => {
    return CategoriesList.map((item) => ({
      id: item.id,
      type: item.type, // Add the type for filtering
      image: [item.image], // Convert single image to array
      price: productCounts[item.type] || 0,
      title: locale === "en" ? item.labelEn : item.label,
      titleEn: item.labelEn,
    }));
  };

  const categoryProducts = transformCategoriesToProducts();

  return (
    <section className="mt-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Modern Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-primary font-normal text-4xl md:text-[50px] block -ml-5 -mb-3 sm:-mb-[30px] leading-normal sm:leading-normal">
              {t("title")}
            </h2>
            <h6 className="text-base mt-10 sm:text-lg lg:text-xl text-gray-600 max-w-lg leading-relaxed mx-auto ">
              {t("subtitle")}
            </h6>
          </div>

          {/* Categories Grid - Using ProductHelper */}
          <div className="mb-16">
            <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
              {CategoriesList.map((item, index) => (
                <div key={item.id}>
                  <div className="relative  overflow-hidden group">
                    <Link 
                      href={item.type === "all" ? "/all" : `/list?cat=${item.type}`}
                      data-discover="true"
                    >
                      <Image
                        width={150}
                        height={100}
                        className="w-full rounded-md transform duration-300 group-hover:scale-110"
                        alt="product-card"
                        src={item.image}
                      />
                    </Link>

                    <div className="flex rounded-md flex-col items-start gap-3 md:gap-4 absolute z-20 w-11/12 bottom-3 xl:bottom-5 left-1/2 transform -translate-x-1/2 p-4 xl:p-5 bg-gray-200 bg-title  bg-opacity-[85%] group-hover:-translate-y-1/2 duration-500 group-hover:opacity-0 group-hover:invisible">
                     
                      <h5 className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-lg leading-relaxed">
                        <Link 
                          href={item.type === "all" ? "/all" : `/list?cat=${item.type}`} 
                          className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-lg leading-relaxed" 
                          data-discover="true"
                        >
                          {locale === "en" ? item.labelEn : item.label}
                        </Link>
                      </h5>
                    </div>

                    <div className="absolute z-10 flex gap-2 justify-center bottom-5 md:bottom-7 w-full transform translate-y-5 opacity-0 duration-500 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible">
                    
                      <Link
                        href={item.type === "all" ? "/all" : `/list?cat=${item.type}`}
                        className="icon-button relative w-9 lg:w-12 h-9 p-2 lg:h-12 bg-white bg-title bg-opacity-80 flex items-center justify-center rounded-full"
                        data-discover="true"
                      >
                        <svg
                          stroke="currentColor"
                          fill="none"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-black h-[22px] w-[20px]"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span className="tooltip">
                          {t("details")}
                          <span className="tooltip-arrow"></span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Categories;
