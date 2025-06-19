"use client";

import { Link } from "@/i18n/navigation";
import React, { useState, Suspense, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import ProductHelper from '@/components/ProductHelper';
import Filter from '@/components/Filter';
import Pagination from '@/components/Pagination';
import { Decimal } from "@prisma/client/runtime/library";
import { getAllProducts } from "@/lib/actions/actions";

const PRODUCT_PER_PAGE = 12;

interface Product {
  id: string;
  title: string;
  titleEn: string;
  category: string;
  images: string[];
  brand: string;
  description: string;
  descriptionEn: string;
  size: string;
  price: Decimal;
  popular: boolean;
  createdAt: Date;
  tbilisi: boolean;
  batumi: boolean;
  qutaisi: boolean;
}

function PageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  const query = searchParams.get("query") || "";
  const pageParam = searchParams.get("page") || "1";
  const currentPage = Number(pageParam);

  const filteredProducts = products.filter((product) => {
    const byBrand = !selectedBrand || product.brand === selectedBrand;
    const byType = !selectedType || product.category === selectedType;
    const byMinPrice = selectedPrice.min === null || Number(product.price) >= selectedPrice.min;
    const byMaxPrice = selectedPrice.max === null || Number(product.price) <= selectedPrice.max;
    const byQuery = !query || product.title.toLowerCase().includes(query.toLowerCase());
    
    return byBrand && byType && byMinPrice && byMaxPrice && byQuery;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return Number(a.price) - Number(b.price);
      case "price-high":
        return Number(b.price) - Number(a.price);
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const pageCount = Math.ceil(sortedProducts.length / PRODUCT_PER_PAGE);
  const currentPageProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCT_PER_PAGE,
    currentPage * PRODUCT_PER_PAGE
  );

  // Transform database products to match ProductHelper interface
  const transformedProducts = currentPageProducts.map(product => ({
    id: product.id,
    image: product.images,
    price: Number(product.price),
    title: product.title
  }));

  const fetchProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-[300px] flex items-center justify-center bg-overlay p-8 sm:p-12 before:bg-title before:bg-opacity-70 overflow-hidden">
        <Image
          src="/bedroom.jpg"
          alt="Background"
          fill
          quality={80}
          className="object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 text-center w-full">
          <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight text-center mb-4">
            ჩვენი პროდუქტები
          </h1>
          <nav className="flex items-center justify-center gap-2 text-base md:text-lg text-white/80">
            <Link href="/" className="hover:text-white transition-colors">
              მთავარი
            </Link>
            <span>/</span>
            <span className="text-primary font-medium">პროდუქტები</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">ფილტრები</h3>
              
              {/* Categories */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">კატეგორიები</h4>
                <div className="space-y-2">
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedType === "" 
                        ? "bg-primary text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedType("")}
                  >
                    ყველა კატეგორია
                  </button>
                  {Array.from(new Set(products.map(p => p.category))).map((type) => (
                    <button
                      key={type}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedType === type 
                          ? "bg-primary text-white" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">ფასის დიაპაზონი</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">მინიმალური ფასი</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={selectedPrice.min ?? ""}
                      onChange={(e) => setSelectedPrice({
                        ...selectedPrice,
                        min: e.target.value === "" ? null : Number(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">მაქსიმალური ფასი</label>
                    <input
                      type="number"
                      placeholder="10000"
                      value={selectedPrice.max ?? ""}
                      onChange={(e) => setSelectedPrice({
                        ...selectedPrice,
                        max: e.target.value === "" ? null : Number(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">ბრენდი</h4>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">ყველა ბრენდი</option>
                  {Array.from(new Set(products.map(p => p.brand))).map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedType("");
                  setSelectedPrice({ min: null, max: null });
                  setSelectedBrand("");
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                ფილტრების გასუფთავება
              </button>
            </div>
          </div>

          {/* Main Product Area */}
          <div className="lg:w-3/4">
            {/* Header with results and sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <p className="text-gray-600">
                  ნაპოვნია <span className="font-semibold text-gray-900">{sortedProducts.length}</span> პროდუქტი
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-600">სორტირება:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="newest">უახლესი</option>
                  <option value="price-low">ფასი: დაბლიდან მაღლა</option>
                  <option value="price-high">ფასი: მაღლიდან დაბლა</option>
                  <option value="name">სახელი: A-Z</option>
                </select>
              </div>
            </div>

            {/* Products Grid using ProductHelper */}
            {transformedProducts.length > 0 ? (
              <ProductHelper items={transformedProducts} />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">პროდუქტი ვერ მოიძებნა</h3>
                <p className="text-gray-600">სცადეთ სხვა ფილტრები ან მოძებნეთ სხვა პროდუქტი</p>
              </div>
            )}

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="mt-12">
                <Pagination pageCount={pageCount} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Main Page component
export default function PageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <PageContent />
    </Suspense>
  );
}
