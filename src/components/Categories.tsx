"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import CategoriesList from "./CategoriesList";
import { getProductCategoryCounts, getAllProducts } from "@/lib/actions/actions";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Categories() {
  const t = useTranslations("categories");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [priceRangeInputs, setPriceRangeInputs] = useState({ min: 0, max: 1000 });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [comingSoonOnly, setComingSoonOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Get URL brand parameter
  const urlBrand = searchParams.get('brand');

  // Fetch products for dynamic brands
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Initialize selectedBrands from URL
  useEffect(() => {
    if (urlBrand) {
      setSelectedBrands([urlBrand]);
    }
  }, [urlBrand]);

  // Memoized brands list
  const brands = useMemo(() => {
    let brs = Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);
    // Only filter by URL brand if we're not clearing filters
    if (urlBrand && selectedBrands.length > 0) {
      brs = brs.filter(
        (brand) => brand.toLowerCase() === urlBrand.toLowerCase()
      );
    }
    return brs.sort();
  }, [products, urlBrand, selectedBrands]);

  useEffect(() => {
    const fetchProductCounts = async () => {
      try {
        setIsLoading(true);
        console.time("Fetch category counts");
        const countsArray = await getProductCategoryCounts();
        console.timeEnd("Fetch category counts");

        // Map Prisma groupBy result to { [category]: count }
        const counts: Record<string, number> = {};
        countsArray.forEach((item: any) => {
          counts[item.category] = item._count.category;
        });

        // Map DB categories to CategoriesList types
        const categoryMapping: Record<string, string> = {
          MATTRESS: "mattress",
          PILLOW: "pillow",
          QUILT: "quilt",
          PAD: "quilt",
          bundle: "bundle",
          BED: "bed",
          OTHERS: "OTHERS",
        };
        const mappedCounts: Record<string, number> = {};
        CategoriesList.forEach((category) => {
          mappedCounts[category.type] = 0;
        });
        Object.entries(counts).forEach(([dbCategory, count]) => {
          const mapped = categoryMapping[dbCategory] || "OTHERS";
          if (mappedCounts.hasOwnProperty(mapped)) {
            mappedCounts[mapped] += count;
          }
        });
        setProductCounts(mappedCounts);
      } catch (error) {
        console.error("Error fetching product counts:", error);
        // Set default counts on error
        const defaultCounts: Record<string, number> = {};
        CategoriesList.forEach((category) => {
          defaultCounts[category.type] = 0;
        });
        setProductCounts(defaultCounts);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductCounts();
  }, []);

  const getLocalizedCategoryLabel = (type: string) => {
    const category = CategoriesList.find((cat) => cat.type === type);
    if (!category) return type;
    return locale === "en" ? category.labelEn : category.label;
  };

  const getProductCount = (categoryType: string) => {
    return productCounts[categoryType] || 0;
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setPriceRange([0, 1000]);
    setPriceRangeInputs({ min: 0, max: 1000 });
    setInStockOnly(false);
    setComingSoonOnly(false);
    setSearchQuery('');
  };

  // Handle search with filters
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("query", searchQuery.trim());
    }
    if (selectedCategory !== 'all') {
      params.set("cat", selectedCategory);
    }
    if (selectedBrands.length > 0) {
      params.set("brand", selectedBrands.join(","));
    }
    if (priceRangeInputs.min > 0 || priceRangeInputs.max < 1000) {
      if (priceRangeInputs.min > 0) {
        params.set("minPrice", priceRangeInputs.min.toString());
      }
      if (priceRangeInputs.max < 1000) {
        params.set("maxPrice", priceRangeInputs.max.toString());
      }
    }
    if (inStockOnly) {
      params.set("inStock", "true");
    }
    if (comingSoonOnly) {
      params.set("comingSoon", "true");
    }
    const url = `/list${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(url);
  };

  // Show all categories (no filtering on main page)
  const filteredCategories = CategoriesList.filter((item) => {
    if (item.type === "all") return false;
    return true; // Show all categories
  });

  if (isLoading) {
    return (
      <div className="containers px-4 md:px-10 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <div className="container mx-auto">
          <div className="max-w-7xl pt-16 mx-auto">


            {/* Side-by-side layout: Filter left, Categories right */}
            <div className="flex gap-8">
              {/* Filter Sidebar */}
              <div className="w-80 flex-shrink-0">
                <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">
                    {locale === "en" ? "Filters" : "ფილტრები"}
                  </h3>

                  {/* Search */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === "en" ? "Search" : "ძიება"}
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={locale === "en" ? "Search products..." : "პროდუქტების ძიება..."}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === "en" ? "Category" : "კატეგორია"}
                    </label>
                    <div className="space-y-2">
                      {['all', 'mattress', 'pillow', 'quilt', 'bed', 'bundle', 'OTHERS'].map((cat) => (
                        <label key={cat} className="flex items-center">
                          <input
                            type="radio"
                            name="category"
                            value={cat}
                            checked={selectedCategory === cat}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="mr-2 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">
                            {cat === 'all' ? (locale === "en" ? "All Categories" : "ყველა კატეგორია") : getLocalizedCategoryLabel(cat)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === "en" ? "Brands" : "ბრენდები"}
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {brands.length > 0 ? (
                        brands.map((brand) => (
                          <label key={brand} className="flex items-center">
                            <input
                              type="checkbox"
                              value={brand}
                              checked={selectedBrands.includes(brand)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedBrands([...selectedBrands, brand]);
                                } else {
                                  setSelectedBrands(selectedBrands.filter(b => b !== brand));
                                }
                              }}
                              className="mr-2 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{brand}</span>
                          </label>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          {locale === "en" ? "No brands found" : "ბრენდები ვერ მოიძებნა"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === "en" ? "Price Range" : "ფასის დიაპაზონი"}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={priceRangeInputs.min}
                        onChange={(e) => setPriceRangeInputs({ ...priceRangeInputs, min: Number(e.target.value) })}
                        placeholder="Min"
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        value={priceRangeInputs.max}
                        onChange={(e) => setPriceRangeInputs({ ...priceRangeInputs, max: Number(e.target.value) })}
                        placeholder="Max"
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Availability Filters */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === "en" ? "Availability" : "ხელმისაწვდომობა"}
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                          className="mr-2 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">
                          {locale === "en" ? "In Stock Only" : "მხოლოდ მარაგში"}
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={comingSoonOnly}
                          onChange={(e) => setComingSoonOnly(e.target.checked)}
                          className="mr-2 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">
                          {locale === "en" ? "Coming Soon" : "მალე ხელმისაწვდომი"}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleSearch}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      {locale === "en" ? "Apply Filters" : "ფილტრების გამოყენება"}
                    </button>
                    <button
                      onClick={clearFilters}
                      className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      {locale === "en" ? "Clear All" : "ყველაფრის გასუფთავება"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Categories Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-12 auto-rows-[200px] md:auto-rows-[240px] gap-6">
                  {filteredCategories.map((category, index) => (
                    <motion.div
                      key={category.id}
            
                    
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                      className={`relative group overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-1000 ${index === 0 ? 'col-span-12 md:col-span-8 row-span-2' :
                          index === 1 ? 'col-span-12 md:col-span-4 row-span-2' :
                            index === 2 ? 'col-span-12 md:col-span-4 row-span-1' :
                              index === 3 ? 'col-span-12 md:col-span-4 row-span-1' :
                                index === 4 ? 'col-span-12 md:col-span-4 row-span-1' :
                                  'col-span-12 md:col-span-6 row-span-1'
                        }`}
                    >
                      <Link href={`/list?cat=${category.type}`}>
                        {/* Image Container */}
                        <div className="relative w-full h-full">
                          <Image
                            src={category.image}
                            alt={getLocalizedCategoryLabel(category.type)}
                            fill
                            unoptimized
                            className="object-cover transition-all duration-1000 group-hover:scale-110 "
                          />



                          {/* Floating Content Bubble */}
                          {/* Modern Content Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-center"
                              >
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                  {getLocalizedCategoryLabel(category.type)}
                                </h3>
                                <p className="text-white/90 text-sm md:text-base mb-4">
                                  {getProductCount(category.type)} {locale === "en" ? "products" : "პროდუქტი"}
                                </p>
                                <motion.button
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="bg-white text-black px-6 py-3 rounded-xl font-semibold  transition-all duration-300 shadow-lg"
                                >
                                  {locale === "en" ? "Explore" : "ნახვა"}
                                </motion.button>
                              </motion.div>
                            </div>
                          </div>




                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View – Swiper */}
      <div className="md:hidden">
        <div className="container pt-10 mx-auto">
          <div className="pt-14">
            <h2 className="text-2xl font-serif font-bold text-center mb-4">
              {locale === "en" ? "Product Categories" : "პროდუქტების კატეგორიები"}
            </h2>
          </div>
          <div className="relative mt-5">
            <Swiper
              modules={[Pagination]}
              slidesPerView={1}
              spaceBetween={16}
              pagination={{
                clickable: true,
                el: ".custom-swiper-pagination",
                renderBullet: (index, className) =>
                  `<span class="${className} w-3 h-3 rounded-full bg-gray-300 transition-all duration-300 hover:bg-gray-400"></span>`,
              }}
              className="pb-12"
            >
              {filteredCategories.map((category, index) => (
                <SwiperSlide key={category.id}>
                  <div className="w-full px-2">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
                    >
                      <Link href={`/list?cat=${category.type}`}>
                        <div className="relative h-44 w-full">
                          <Image
                            src={category.image}
                            alt={getLocalizedCategoryLabel(category.type)}
                            fill
                            unoptimized
                            className="object-cover transition-all duration-500 "
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-500"></div>
                        </div>
                        <div className="absolute top-2 left-2 inline-flex items-center gap-2 h-8 px-3 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 text-black font-semibold text-sm transition-all hover:bg-white truncate max-w-[140px]">
                          {getLocalizedCategoryLabel(category.type)}
                          {getProductCount(category.type) > 0
                            ? ` (${getProductCount(category.type)})`
                            : ""}
                        </div>
                      </Link>
                    </motion.div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Pagination container */}
            <div className="custom-swiper-pagination flex justify-center gap-2 mt-4" />
          </div>
        </div>
      </div>
    </>
  );
}
