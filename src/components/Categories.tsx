"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import CategoriesList from "./CategoriesList";
import { getAllProducts } from "@/lib/actions/actions";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
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
        const counts: Record<string, number> = {};
        products.forEach((product: any) => {
          const category = product.category;
          counts[category] = (counts[category] || 0) + 1;
        });
        setProductCounts(counts);
      } catch (error) {
        console.error("Error fetching product counts:", error);
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
      <h1 className="text-3xl  flex justify-center items-center font-light text-gray-900 leading-tight">
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
                  <div className="relative group rounded-xl overflow-hidden shadow-md border-4 border-[#feeb9d] transition-all duration-300">
                    <Link href={`/list?cat=${category.type}`}>
                      {/* Image */}
                      <div className="relative h-64 w-full">
                        <Image
                          src={category.image}
                          alt={getLocalizedCategoryLabel(category.type)}
                          fill
                          className="object-cover rounded-xl"
                        />
                      </div>

                      {/* Badge */}
                      <div className="absolute top-2 left-2 bg-white text-black text-sm font-medium px-3 py-1 rounded-full shadow">
                        {getLocalizedCategoryLabel(category.type)}
                        {productCounts[category.type]
                          ? ` (${productCounts[category.type]})`
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
      <div className="lg:hidden">
        <div className="flex justify-around mb-4 gap-4">
          <button
            ref={prevRef}
            className="text-[#ce7c2a] text-xl font-bold hover:scale-110 transition"
          >
            ←
          </button>
          <button
            ref={nextRef}
            className="text-[#ce7c2a] text-xl font-bold hover:scale-110 transition"
          >
            →
          </button>
        </div>

        <Swiper
          modules={[Navigation]}
          slidesPerView={1}
          spaceBetween={16}
          onInit={(swiper) => {
            if (
              typeof swiper.params.navigation !== "boolean" &&
              swiper.params.navigation
            ) {
              swiper.params.navigation.prevEl = prevRef.current!;
              swiper.params.navigation.nextEl = nextRef.current!;
              swiper.navigation.init();
              swiper.navigation.update();
            }
          }}
        >
          {filteredCategories.map((category, index) => (
            <SwiperSlide key={category.id}>
              <div
                className={`w-full px-2 wow fadeInUp`}
                data-wow-delay={`${(index + 1) * 0.1}s`}
              >
                <div className="relative group rounded-xl overflow-hidden shadow-md border-4 border-[#feeb9d] transition-all duration-300">
                  <Link href={`/list?cat=${category.type}`}>
                    {/* Image */}
                    <div className="relative h-64 w-full">
                        <Image
                          src={category.image}
                          alt={getLocalizedCategoryLabel(category.type)}
                          fill
                          className="object-cover rounded-xl"
                        />
                      </div>

                    {/* Badge */}
                    <div className="absolute top-2 left-2 bg-white text-black text-sm font-medium px-3 py-1 rounded-full shadow">
                      {getLocalizedCategoryLabel(category.type)}
                      {productCounts[category.type]
                        ? ` (${productCounts[category.type]})`
                        : ""}
                    </div>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
