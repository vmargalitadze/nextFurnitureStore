"use client";
import BrandSlider from "@/components/BrandSlider";
import Categories from "@/components/Categories";
import ProductList from "@/components/ProductList";
import SideLogo from "@/components/SideLogo";
import Hero from "@/components/Slider";
import Filter from "@/components/Filter";
import React, { useState, Suspense, useEffect } from "react";
import { getAllProducts } from "@/lib/actions/actions";

// Loading component for Suspense boundaries
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const HomePage = () => {
  // Filter state for Filter component
  const [selectedType, setSelectedType] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [filterOpen, setFilterOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const products = await getAllProducts();
      setCategories(Array.from(new Set(products.map((p: any) => p.category))));
    };
    fetchCategories();
  }, []);

  // Wrapper function to match Filter component's expected signature
  const handlePriceChange = (price: { min: number | null; max: number | null }) => {
    setSelectedPrice(price);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sticky Filter Sidebar - Full Height */}
      <div className="lg:w-1/4 w-full lg:min-h-screen lg:sticky lg:top-0 lg:left-0 lg:z-10">
        <div className="lg:h-full lg:flex lg:flex-col">
          <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
            <Filter
              open={filterOpen}
              setOpen={setFilterOpen}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selectedPrice={selectedPrice}
              setSelectedPrice={handlePriceChange}
              categories={categories || []}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:w-3/4 w-full">
        <Suspense fallback={<LoadingSpinner />}>
          <Categories />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <SideLogo />
        </Suspense>
        <div className="">
          <Suspense fallback={<LoadingSpinner />}>
            <ProductList
              selectedType={selectedType}
              selectedBrand={selectedBrand}
              selectedPrice={selectedPrice}
            />
          </Suspense>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <BrandSlider />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
