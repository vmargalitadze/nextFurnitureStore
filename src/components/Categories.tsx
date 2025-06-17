"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import React from "react";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import CategoriesList from "./CategoriesList";

function Categories() {
  const t = useTranslations('categories');
  const locale = useLocale();

  return (
    <section className="py-20">
      <div className="container-fluid">
        <div className="max-w-[1000px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-2">
            {/* Category Cards */}
            {CategoriesList.map((item) => (
              <Link 
                key={item.id}
                href={item.type === "all" ? "/all" : `/list?cat=${item.type}`} 
                className="relative group overflow-hidden"
                data-discover="true"
              >
                <Image
                  src={item.image}
                  alt={locale === 'en' ? item.labelEn : item.label}
                  width={300}
                  height={300}
                  className="duration-300 transform scale-100 group-hover:scale-110 w-full"
                />
                <div className="absolute bottom-5 sm:bottom-8 lg:bottom-12 w-full left-0 px-7 flex justify-center">
                  <div className="bg-white bg-opacity-80 dark:bg-title dark:bg-opacity-80 p-5 z-10">
                    <h4 className="font-semibold leading-[1.5]">
                      {locale === 'en' ? item.labelEn : item.label}
                    </h4>
                    <p className="leading-none mt-[10px]">
                      {item.quantity} {t('products')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Categories;
