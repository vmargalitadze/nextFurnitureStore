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
    categories: string[];
    hideBrandFilter?: boolean;
}

const Filter = ({
    setSelectedType,
    selectedType,
    selectedBrand,
    setSelectedBrand,
    selectedPrice,
    setSelectedPrice,
    categories,
    hideBrandFilter = false,
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
    <div className="
    bg-white rounded-2xl  shadow-xl border border-gray-100 p-6 lg:mt-16 
    overflow-y-scroll 
    max-h-[85vh] 
    scrollbar-none 
    [&::-webkit-scrollbar]:hidden 
    [-ms-overflow-style:'none'] 
    [scrollbar-width:'none']
  ">
      <h3 className="text-2xl mt-5 font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">
        {t('filters.title')}
      </h3>
      
      {/* Categories */}
      <div className="mb-8 ">
        <h4 className="text-lg gap-x-6 font-semibold text-gray-800 mb-4 flex items-center gap-2">
          {t('filters.categories.title')}
        </h4>
        <button
          className={`w-full mb-2 text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${selectedType === "" ? "bg-[#438c71] text-white shadow-lg shadow-primary/25" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 hover:border-gray-300"}`}
          onClick={() => handleCategoryChange("")}
        >
          {t('filters.categories.allCategories')}
        </button>
        {categories.map((type) => (
          <button
            key={type}
            className={`w-full mb-2 text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${selectedType === type ? "bg-[#438c71] text-white shadow-lg shadow-primary/25" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 hover:border-gray-300"}`}
            onClick={() => handleCategoryChange(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
         
          {t('filters.priceRange.title')}
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-[16px] font-medium text-gray-700 mb-2">
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
            <label className="block text-[16px] font-medium text-gray-700 mb-2">
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
      {!hideBrandFilter && (
        <>
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
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
        </>
      )}

      {/* Clear Filters */}
      <button
        onClick={() => {
          setSelectedType("");
          setSelectedPrice({ min: null, max: null });
          setSelectedBrand("");
        }}
        className="w-full mt-9 bg-[#438c71] text-white py-3 px-4 rounded-xl  transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300"
      >
        {t('filters.clearFilters')}
      </button>
    </div>
  );
};

export default Filter;
