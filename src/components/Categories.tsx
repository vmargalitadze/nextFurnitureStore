"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import CategoriesList from "./CategoriesList";
import { getAllProducts } from "@/lib/actions/actions";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Categories() {
  const t = useTranslations("categories");
  const locale = useLocale();
  const [productCounts, setProductCounts] = useState<Record<string, number>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchProductCounts = async () => {
      try {
        setIsLoading(true);
        const products = await getAllProducts();
        
        // Create a mapping from database category values to CategoriesList types
        const categoryMapping: Record<string, string> = {
          'MATTRESS': 'mattress',
          'PILLOW': 'pillow', 
          'QUILT': 'quilt',
          'PAD': 'quilt', // Map PAD to quilt since there's no PAD in CategoriesList
          'bundle': 'bundle',
          'BED': 'bed',
          'OTHERS': 'OTHERS'
        };

        const counts: Record<string, number> = {};
        
        // Initialize counts for all categories in CategoriesList
        CategoriesList.forEach(category => {
          counts[category.type] = 0;
        });

        // Count products by category
        products.forEach((product: any) => {
          const dbCategory = product.category;
          const mappedCategory = categoryMapping[dbCategory];
          
          if (mappedCategory && counts.hasOwnProperty(mappedCategory)) {
            counts[mappedCategory]++;
          } else {
            // If no mapping found, count as OTHERS
            if (counts.hasOwnProperty('OTHERS')) {
              counts['OTHERS']++;
            }
          }
        });

       
        
        setProductCounts(counts);
      } catch (error) {
        console.error("Error fetching product counts:", error);
        // Set default counts on error
        const defaultCounts: Record<string, number> = {};
        CategoriesList.forEach(category => {
          defaultCounts[category.type] = 0;
        });
        setProductCounts(defaultCounts);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductCounts();
  }, []);

  const getLocalizedCategoryLabel = (type: string) => {
    const category = CategoriesList.find((cat) => cat.type === type);
    if (!category) return type;
    return locale === "en" ? category.labelEn : category.label;
  };

  const getProductCount = (categoryType: string) => {
    return productCounts[categoryType] || 0;
  };

  const filteredCategories = CategoriesList.filter(
    (item) => item.type !== "all"
  );

  if (isLoading) {
    return (
      <div className="containers px-4 md:px-10  py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className=" text-3xl md:text-[45px]   flex justify-center items-center font-light text-gray-900 leading-tight">
        {t("title")}
      </h1>
      <div className="hidden mt-10 md:block">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap -mx-2">
              {filteredCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="w-full md:w-4/12 lg:w-4/12 px-2 mb-6"
                >
                  <div className="relative group rounded-xl overflow-hidden  shadow-lg  hover:shadow-xl transition-all duration-300">
                    <Link href={`/list?cat=${category.type}`}>
                      {/* Image */}
                      <div className="relative h-[200px] w-full">
                        <Image
                          src={category.image}
                          alt={getLocalizedCategoryLabel(category.type)}
                          fill
                          className="object-cover rounded-xl"
                        />
                      </div>

                      {/* Badge */}
                      <div className="absolute top-2 left-2  inline-flex items-center gap-2 h-[40px] px-4 rounded-full bg-white/70 backdrop-blur-md border border-gray-200 text-black font-semibold transition-all hover:bg-white truncate max-w-[160px]">
                        {getLocalizedCategoryLabel(category.type)}
                        {getProductCount(category.type) > 0
                          ? ` (${getProductCount(category.type)})`
                          : ""}
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View – Swiper */}
      <div className="md:hidden">
        <div className="container mx-auto">
          <div className="relative mt-5">
            <Swiper
              modules={[Pagination]}
              slidesPerView={1}
              spaceBetween={16}
              pagination={{
                clickable: true,
                el: ".custom-swiper-pagination",
                renderBullet: (index, className) =>
                  `<span class="${className} w-3 h-3 rounded-full bg-gray-300 transition-all duration-300 hover:bg-gray-400"></span>`,
              }}
              className="pb-12"
            >
              {filteredCategories.map((category, index) => (
                <SwiperSlide key={category.id}>
                  <div className="w-full px-2">
                    <div className="relative group rounded-xl overflow-hidden  shadow-lg  hover:shadow-xl transition-all duration-300">
                      <Link href={`/list?cat=${category.type}`}>
                        <div className="relative h-[200px] w-full">
                          <Image
                            src={category.image}
                            alt={getLocalizedCategoryLabel(category.type)}
                            fill
                            className="object-cover rounded-xl"
                          />
                        </div>
                        <div className="absolute top-2 left-2  inline-flex items-center gap-2 h-[40px] px-4 rounded-full bg-white/70 backdrop-blur-md border border-gray-200 text-black font-semibold transition-all hover:bg-white truncate max-w-[160px]">
                          {getLocalizedCategoryLabel(category.type)}
                          {getProductCount(category.type) > 0
                            ? ` (${getProductCount(category.type)})`
                            : ""}
                        </div>
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* ✅ ამოიტანე pagination container swiper-ის გარეთ */}
            <div className="custom-swiper-pagination flex justify-center gap-2 mt-4" />
          </div>
        </div>
      </div>
    </>
  );
}
