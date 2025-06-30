import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Trash2, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { getAllProducts } from "@/lib/actions/actions";

interface FilterState {
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: { min: number; max: number };
  searchQuery: string;
}

interface FilterProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  onFilterChange: (filters: FilterState) => void;
}

const ListSideBar: React.FC<FilterProps> = ({ isOpen, toggleSidebar, onFilterChange }) => {
  const t = useTranslations("allPage.filters");
  const locale = useLocale();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [currentPriceRange, setCurrentPriceRange] = useState({ min: 0, max: 1000 });

  // Manage body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
        const prices = data.flatMap((product: any) => product.sizes?.map((s: any) => parseFloat(s.price)) || [parseFloat(product.price)]).filter(p => !isNaN(p));
        if (prices.length > 0) {
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceRange({ min, max });
          setCurrentPriceRange({ min, max });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))).filter(Boolean), [products]);
  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand))).filter(Boolean), [products]);

  const getLocalizedCategoryLabel = useCallback((category: string) => {
    const map: Record<string, { en: string; ge: string }> = {
      bundle: { en: "Bundle", ge: "კომპლექტი" },
      pillow: { en: "Pillow", ge: "ბალიში" },
      mattress: { en: "Mattress", ge: "მატრასი" },
      bed: { en: "Bed", ge: "საწოლი" },
      quilt: { en: "Quilt", ge: "საბანი" },
      OTHERS: { en: "Others", ge: "სხვა" }
    };
    const label = map[category.toLowerCase()] || { en: category, ge: category };
    return locale === "en" ? label.en : label.ge;
  }, [locale]);

  const applyFilters = () => {
    onFilterChange({
      selectedCategories,
      selectedBrands,
      priceRange: currentPriceRange,
      searchQuery,
    });
    toggleSidebar(); // Close sidebar after applying filters
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setCurrentPriceRange(priceRange);
    setSearchQuery("");
    onFilterChange({ selectedCategories: [], selectedBrands: [], priceRange, searchQuery: "" });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  const handleClose = () => {
    toggleSidebar();
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return null; // Don't show loading state for sidebar
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 top-0 bg-black/50 z-[1]"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-60 md:w-80 bg-white shadow-lg transform transition-transform duration-300 z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b mt-20">
          <h2 className="text-lg font-semibold text-gray-800">
            {t("title")}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-120px)]">
          {/* Search */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("search")}</h3>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                   className="w-full px-4 py-2 pl-17 md:pl-10 border-2 border-gray-200 rounded-lg text-gray-800 transition-all duration-300 placeholder-gray-400"
                onKeyDown={handleKeyPress}
              />
               <Search className="absolute  md:left-3  top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("categories.title")} ({categories.length})</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category])}
                    className="mr-3 rounded border-gray-300 text-[#438c71] focus:ring-[#438c71]"
                  />
                  {getLocalizedCategoryLabel(category)}
                </label>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("brand.title")} ({brands.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])}
                    className="mr-3 rounded border-gray-300 text-[#438c71] focus:ring-[#438c71]"
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("priceRange.title")}</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                value={currentPriceRange.min}
                min={priceRange.min}
                max={priceRange.max}
                onChange={(e) => setCurrentPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#438c71]"
                placeholder="Min"
              />
              <input
                type="number"
                value={currentPriceRange.max}
                min={priceRange.min}
                max={priceRange.max}
                onChange={(e) => setCurrentPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#438c71]"
                placeholder="Max"
              />
            </div>
            <div className="text-xs text-gray-500">
              ₾{currentPriceRange.min} - ₾{currentPriceRange.max}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t space-y-2">
            <button 
              onClick={applyFilters} 
              className="w-full px-4 py-2 text-sm font-medium text-white bg-[#438c71] rounded-lg hover:bg-[#3a7a5f] transition-colors"
            >
              {t("search")}
            </button>
            <button 
              onClick={clearFilters} 
              className="w-full px-4 py-2 text-sm font-medium border border-[#438c71] text-[#438c71] rounded-lg hover:bg-[#438c71] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> {t("clearFilters")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListSideBar;