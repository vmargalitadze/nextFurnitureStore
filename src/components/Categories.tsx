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
            <h2 className="text-primary font-secondary font-normal text-4xl md:text-[70px] block -ml-5 -mb-3 sm:-mb-[30px] leading-normal sm:leading-normal">
              {t("title")}
            </h2>
            <h6 className="text-base mt-10 sm:text-lg lg:text-xl text-gray-600 max-w-lg leading-relaxed mx-auto ">
              {t("subtitle")}
            </h6>
          </div>

          {/* Categories Grid - Using ProductHelper */}
          <div className="mb-16">
            <ProductHelper items={categoryProducts} />
          </div>

      
        </div>
      </div>
    </section>
  );
}

export default Categories;
