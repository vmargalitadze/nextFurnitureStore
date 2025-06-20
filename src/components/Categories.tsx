"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import CategoriesList from "./CategoriesList";
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

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Modern Section Header */}
          <div className="text-center mb-20">
            
            <h2 className="text-primary font-secondary font-normal text-4xl md:text-[60px] block -ml-5 -mb-3 sm:-mb-[30px] leading-normal sm:leading-normal">
              {t("title")}
            </h2>
           
            <p className="text-xl text-gray-600 mt-7 max-w-3xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* Modern Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CategoriesList.map((item, index) => (
              <Link
                key={item.id}
                href={item.type === "all" ? "/all" : `/list?cat=${item.type}`}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                data-discover="true"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Background Image with Overlay */}
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={locale === "en" ? item.labelEn : item.label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                  
                  {/* Floating Badge with Real Quantity */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-800 shadow-lg">
                    {productCounts[item.type] || 0} {t("products")}
                  </div>
                </div>

                {/* Content Card */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="transform translate-y-2  transition-transform duration-300">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-[#bba588] transition-colors duration-300">
                      {locale === "en" ? item.labelEn : item.label}
                    </h3>
                 
                  </div>
                </div>

             
              </Link>
            ))}
          </div>

          {/* Call to Action */}
      
        </div>
      </div>
    </section>
  );
}

export default Categories;
