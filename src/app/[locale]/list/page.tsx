"use client"

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import Products from "@/lib/product"; 
import { Link } from "@/i18n/navigation";
import ProductHelper from "@/components/ProductHelper";


function PageContentWrapper() {
  const searchParams = useSearchParams();
  const category = searchParams.get("cat");

const query = searchParams.get("query") || "";
const filteredProducts = Products.filter((product) => {
  const matchesCategory = category
    ? product.title?.toLowerCase() === category.toLowerCase()
    : true;
  const matchesQuery = query
    ? product.title.toLowerCase().includes(query.toLowerCase())
    : true;
  return matchesCategory && matchesQuery;
});
    
  return (
    <>
     <div className="relative min-h-[400px] flex items-center justify-center bg-overlay p-14 sm:p-16 before:bg-title before:bg-opacity-70 overflow-hidden">

      <Image
        src="/bed.jpg"
        alt="Background"
        fill
        quality={80}
        className="object-cover z-0"
      />


      <div className="absolute inset-0 bg-black/60 z-10" />


      <div className="relative z-20 text-center w-full">
      <h2 className="text-white text-2xl md:text-[40px] font-normal leading-none text-center">{ category }</h2>
        <ul className="flex items-center justify-center gap-[10px] text-base md:text-lg leading-none font-normal text-white mt-3 md:mt-4">
          <li>
            <Link href="/" data-discover="true">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-primary capitalize">{ category }</li>
        </ul>
      </div>
    </div>


      <div className="container mt-[50px]">

    
        <ProductHelper items={filteredProducts} />
      </div>
  
    </>
  );
}


export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <PageContentWrapper />
    </Suspense>
  );
}

