"use client";
import CategoriesList from "./CategoriesList";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { getAllProducts } from "@/lib/actions/actions";

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

interface FilterProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    setSelectedType: (type: string) => void;
    selectedType: string;
    selectedBrand: string;
    setSelectedBrand: (brand: string) => void;
    selectedPrice: { min: number | null; max: number | null };
    setSelectedPrice: (price: { min: number | null; max: number | null }) => void;
}

const Filter = ({
    setSelectedType,
    selectedType,
    selectedBrand,
    setSelectedBrand,
    selectedPrice,
    setSelectedPrice,
}: FilterProps) => {
  const t = useTranslations('allPage');
  const locale = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        // Convert the data to match the Product interface
        const productsWithDecimalPrices = data.map(product => ({
          ...product,
          sizes: product.sizes?.map(size => ({
            ...size,
            price: new SimpleDecimal(size.price)
          })) || undefined,
          sales: product.sales || undefined
        }));
        setProducts(productsWithDecimalPrices as Product[]);
        
        // Debug: Log unique categories
        const uniqueCategories = Array.from(new Set(data.map(p => p.category)));
        console.log('Available categories in database:', uniqueCategories);
        console.log('CategoriesList types:', CategoriesList.map(c => c.type));
        
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Get unique brands from actual products
  const BrandFilter = Array.from(new Set(products.map((product) => product.brand))).filter(Boolean);

  const handleCategoryChange = (type: string) => {
    console.log('Category changed:', type);
    setSelectedType(type);
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
  };

  const handlePriceChange = (minPrice: number | null, maxPrice: number | null) => {
    setSelectedPrice({ min: minPrice, max: maxPrice });
  };

  // Get localized category label
  const getLocalizedCategoryLabel = (type: string) => {
    const category = CategoriesList.find(cat => cat.type === type);
    if (!category) return type;
    return locale === "en" ? category.labelEn : category.label;
  };

  return (
    <div className="bg-white  rounded-2xl shadow-xl border border-gray-100 p-6 lg:m-6">
      <h3 className="text-2xl mt-5 font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">
        {t('filters.title')}
      </h3>
      
      {/* Categories */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          {t('filters.categories.title')}
        </h4>
        <div className="space-y-2">
          <button
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              selectedType === "" 
                ? "bg-primary text-white shadow-lg shadow-primary/25" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleCategoryChange("")}
          >
            {t('filters.categories.allCategories')}
          </button>
          {CategoriesList.filter(item => item.type !== "all").map((item) => (
            <button
              key={item.id}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                selectedType === item.type 
                  ? "bg-primary text-white shadow-lg shadow-primary/25" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleCategoryChange(item.type)}
            >
              {getLocalizedCategoryLabel(item.type)}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          {t('filters.priceRange.title')}
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('filters.priceRange.minimumPrice')}
            </label>
            <input
              type="number"
              placeholder="0"
              value={selectedPrice.min ?? ""}
              onChange={(e) => handlePriceChange(e.target.value === "" ? null : Number(e.target.value), selectedPrice.max)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('filters.priceRange.maximumPrice')}
            </label>
            <input
              type="number"
              placeholder="10000"
              value={selectedPrice.max ?? ""}
              onChange={(e) => handlePriceChange(selectedPrice.min, e.target.value === "" ? null : Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {t('filters.brand.title')}
        </h4>
        <select
          value={selectedBrand}
          onChange={(e) => handleBrandChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white"
          disabled={loading}
        >
          <option value="">
            {t('filters.brand.allBrands')}
          </option>
          {BrandFilter.map((brand) => (
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
        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300"
      >
        {t('filters.clearFilters')}
      </button>
    </div>
  );
};

export default Filter;
