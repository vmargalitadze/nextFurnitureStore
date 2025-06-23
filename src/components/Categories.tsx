"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import CategoriesList from "./CategoriesList";
import { getAllProducts } from "@/lib/actions/actions";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";

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

function Categories() {
  const t = useTranslations("categories");
  const locale = useLocale();
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const fetchProductCounts = async () => {
      try {
        const products = await getAllProducts();
        const counts: Record<string, number> = {};
        CategoriesList.forEach(category => {
          counts[category.type.toLowerCase()] = 0;
        });
        products.forEach((product) => {
          const category = product.category.toLowerCase();
          if (counts.hasOwnProperty(category)) {
            counts[category]++;
          }
        });
        setProductCounts(counts);
        // Set images as loaded immediately after data fetch
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error fetching product counts:", error);
        setImagesLoaded(true); // Still set to true to show content
      }
    };
    fetchProductCounts();
  }, []);

  const transformCategoriesToProducts = () => {
    return CategoriesList.map((item) => ({
      id: item.id,
      type: item.type,
      image: [item.image],
      price: productCounts[item.type] || 0,
      title: locale === "en" ? item.labelEn : item.label,
      titleEn: item.labelEn,
    }));
  };

  const categoryProducts = transformCategoriesToProducts();

  return (
    <section className="mt-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-2">
        <div className="max-w-7xl mt-10 mx-auto">
          {/* Swiper Category Slider */}
          <div className="w-full mt-10 ">
            {!imagesLoaded ? (
              // Skeleton Loading State
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="animate-pulse">
                      {/* Skeleton Image */}
                      <div className="w-full h-[192px] bg-gray-200 rounded-3xl mb-3"></div>
                      {/* Skeleton Title */}
                      <div className="w-[70%] h-4 bg-gray-200 rounded mx-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Swiper
                spaceBetween={15}
                slidesPerView={1}
                loop={true}
                autoplay={{
                  delay: 0,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: false,
                }}
                speed={3000}
                freeMode={true}
                modules={[FreeMode, Autoplay]}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 5 },
                  1280: { slidesPerView: 5 },
                }}
                className="category-swiper"
              >
                {CategoriesList.map((item, index) => (
                  <SwiperSlide key={item.id}>
                    <div className="relative z-1 h-full group flex flex-col items-center justify-between py-2">
                      <div className="overflow-hidden rounded-3xl w-full">
                        <Link
                          href={
                            item.type === "all"
                              ? "/all"
                              : `/list?cat=${item.type}`
                          }
                        >
                          <Image
                            src={item.image}
                            alt={locale === "en" ? item.labelEn : item.label}
                            width={192}
                            height={192}
                            priority={index < 5}
                            loading={index < 5 ? "eager" : "lazy"}
                            className="w-full rounded-3xl duration-500 group-hover:-translate-y-5 object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                          />
                        </Link>
                      </div>
                      <div className="py-3 w-full flex flex-col items-center">
                        <h6 className="w-[70%] max-xl:w-full text-center text-base font-semibold text-gray-800">
                          <Link
                            href={
                              item.type === "all"
                                ? "/all"
                                : `/list?cat=${item.type}`
                            }
                          >
                            {locale === "en" ? item.labelEn : item.label}
                          </Link>
                        </h6>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Categories;
