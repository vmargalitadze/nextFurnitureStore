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
    <section className="relative  mt-10 z-10 rounded-4xl bg-lightdark pt-10 pb-5 sm:pt-14 sm:pb-6 px-5 md:pt-17 md:pb-10 2xl:pt-24 2xl:pb-16 md:px-20">
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CategoriesList.filter(item => item.type !== "all").map((item, index) => {
          const label = locale === "en" ? item.labelEn : item.label;
  
          // განსხვავებული დიზაინი ინდექსზე დაყრდნობით
          const extraClasses = [
            "rounded-3xl", // default
            "rounded-ee-[3rem]",
            "rounded-es-[3rem]",
            "rounded-ss-[3rem]",
            "rounded-se-[3rem]",
            "rounded-[2rem]",
          ];
  
          const borderColors = [
            "border-gray-200",
            "border-gray-200",
            "border-gray-200",
            "border-gray-200",
            "border-gray-200",
            "bborder-gray-200",
          ];
  
          return (
            <div
              key={item.id}
              className={`relative wow fadeInUp group cursor-pointer`}
              style={{
                animationDelay: `${0.2 + index * 0.1}s`,
                animationName: 'fadeInUp',
                visibility: 'visible',
              }}
            >
              <Link href={`/list?cat=${item.type}`}>
                <div className="relative z-10 transition-all duration-500 group-hover:-translate-y-4 group-hover:scale-105 group-hover:z-20">
                  <Image
                    src={item.image}
                    alt={label}
                    width={400}
                    height={300}
                    priority={index < 3}
                    loading={index < 3 ? "eager" : "lazy"}
                    className={`w-full h-[300px] max-sm:h-[150px] object-cover border-4 ${borderColors[index % borderColors.length]} ${extraClasses[index % extraClasses.length]} transition-all duration-500 group-hover:shadow-2xl`}
                  />
                  <div
                    className={`absolute bottom-5 ${
                      index % 2 === 0 ? 'left-0 max-lg:-left-3' : 'right-0 max-lg:-right-3'
                    } bg-white border-4 border-white font-semibold text-[18px] max-lg:text-sm max-sm:text-xs py-2 px-4 rounded-xl shadow-md transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-lg`}
                  >
                    {label}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  
    {/* Rotating Button */}
    <Link
      href="/all"
      className="hidden lg:inline-block absolute left-1/2 top-[-7%] transform -translate-x-1/2 -translate-y-[7%] w-[140px] h-[140px] p-2.5 rounded-full border border-white animate-rotate"
    >
      <div className="flex items-center justify-center w-full h-full rounded-full text-black border border-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 animate-rotate"
          viewBox="0 0 40 40"
          fill="none"
        >
          <path
            d="M10.72 31.31L19 39.59c.26.26.62.41 1 .41s.74-.15 1-.41l8.28-8.28a1.33 1.33 0 00-1.89-1.89L21 36.84V1a1 1 0 10-2 0v35.84l-6.91-6.91a1.33 1.33 0 10-1.89 1.89z"
            fill="currentColor"
          />
        </svg>
      </div>
    </Link>
  </section>
  
  );
}

export default Categories;
