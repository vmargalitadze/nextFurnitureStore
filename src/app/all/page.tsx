"use client";

import Link from 'next/link';
import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Products from '@/lib/product';
import ProductHelper from '@/components/ProductHelper';
import Filter from '@/components/Filter';
import Pagination from '@/components/Pagination';

const PRODUCT_PER_PAGE = 4;

function PageContent() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  const query = searchParams.get("query") || "";
  const pageParam = searchParams.get("page") || "1"; // <-- ვიღებთ ?page=2 აქედან
  const currentPage = Number(pageParam);

  const filteredProducts = Products.filter((product) => {
    const byBrand = !selectedBrand || product.Brand === selectedBrand;
    const byType = !selectedType || product.type === selectedType;
    const byMinPrice = selectedPrice.min === null || product.price >= selectedPrice.min;
    const byMaxPrice = selectedPrice.max === null || product.price <= selectedPrice.max;
    const byQuery = !query || product.title.toLowerCase().includes(query.toLowerCase());
    
    return byBrand && byType && byMinPrice && byMaxPrice && byQuery;
  });

  const pageCount = Math.ceil(filteredProducts.length / PRODUCT_PER_PAGE);
  const currentPageProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCT_PER_PAGE,
    currentPage * PRODUCT_PER_PAGE
  );

  return (
    <>
      {/* Header Section */}
      <div className="relative min-h-[400px] flex items-center justify-center bg-overlay p-14 sm:p-16 before:bg-title before:bg-opacity-70 overflow-hidden">
        <Image
          src="/bedroom.jpg"
          alt="Background"
          fill
          quality={80}
          className="object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative z-20 text-center w-full">
          <h2 className="text-white text-8 md:text-[40px] font-normal leading-none text-center">
            ჩვენი პროდუქტები
          </h2>
          <ul className="flex items-center justify-center gap-[10px] text-base md:text-lg leading-none font-normal text-white mt-3 md:mt-4">
            <li>
              <Link href="/" data-discover="true">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary capitalize">პროდუქტები</li>
          </ul>
        </div>
      </div>

      {/* Content */}
      <div className="container mt-[50px]">
        <Filter
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          open={open}
          setOpen={setOpen}
        />
        <ProductHelper items={currentPageProducts} />
      </div>

      {/* Pagination */}
      <div className="mt-9">
        <Pagination pageCount={pageCount} />
      </div>
    </>
  );
}

// --- მთავარი Page component ---
export default function PageWrapper() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
