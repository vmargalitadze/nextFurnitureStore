"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import CategoriesList from "./CategoriesList";
import { getAllProducts } from "@/lib/actions/actions";

interface ProductSize {
  id: string;
  size: string;
  price: any;
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
  price?: any;
  sales?: number;
}

export default function Categories() {
  const t = useTranslations("categories");
  const locale = useLocale();
  const [productCounts, setProductCounts] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    const fetchProductCounts = async () => {
      try {
        const products = await getAllProducts();
        const counts: Record<string, number> = {};
        CategoriesList.forEach((category) => {
          counts[category.type.toLowerCase()] = 0;
        });
        products.forEach((product) => {
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

  const getLocalizedCategoryLabel = (type: string) => {
    const category = CategoriesList.find((cat) => cat.type === type);
    if (!category) return type;
    return locale === "en" ? category.labelEn : category.label;
  };

  const filteredCategories = CategoriesList.filter(
    (item) => item.type !== "all"
  );

  return (
    <div className="content-inner category-section">
      <div className="container mx-auto">
        <div className="flex flex-wrap -mx-2">
          {filteredCategories.map((category, index) => (
            <div
              key={category.id}
              className={`w-full md:w-4/12 lg:w-4/12 px-2 wow fadeInUp`}
              data-wow-delay={`${(index + 1) * 0.1}s`}
            >
              <div
                className={`category-product ${
                  index < 3 ? "left" : "right"
                } product-${index + 1}`}
              >
                <Link href={`/list?cat=${category.type}`}>
                  <Image
                    src={category.image}
                    alt={getLocalizedCategoryLabel(category.type)}
                    width={300}
                    height={200}
                    className="w-full h-auto img object-cover"
                  />
                  <div className="category-badge">
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
  );
}
