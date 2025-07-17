import React, {
  useState,
  useEffect,
  useImperativeHandle,
  useMemo,
  useCallback,
} from "react";
import { X, Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { getAllProducts } from "@/lib/actions/actions";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

interface SideBarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  onFilterChange?: (filters: FilterState) => void;
  ref?: React.RefObject<{ clearFilters: () => void }>;
}

interface FilterState {
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: { min: number; max: number };
}

const SideBar: React.FC<SideBarProps> = ({
  isOpen,
  toggleSidebar,
  onFilterChange,
  ref,
}) => {
  const t = useTranslations("allPage.filters");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [currentPriceRange, setCurrentPriceRange] = useState({
    min: 0,
    max: 1000,
  });

  const urlCategory = searchParams.get("cat");
  const urlBrand = searchParams.get("brand");
  const urlQuery = searchParams.get("query");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      document.body.style.overflow = isOpen ? "hidden" : "auto";
      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (urlCategory) setSelectedCategories([urlCategory]);
    if (urlBrand) setSelectedBrands([urlBrand]);
    if (urlQuery) setSearchQuery(urlQuery);
  }, [urlCategory, urlBrand, urlQuery]);

  const categories = useMemo(() => {
    let cats = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
    if (urlCategory && selectedCategories.length > 0) {
      cats = cats.filter((cat) => cat.toLowerCase() === urlCategory.toLowerCase());
    }
    return cats;
  }, [products, urlCategory, selectedCategories]);

  const brands = useMemo(() => {
    let brs = Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);
    if (urlBrand && selectedBrands.length > 0) {
      brs = brs.filter((brand) => brand.toLowerCase() === urlBrand.toLowerCase());
    }
    return brs;
  }, [products, urlBrand, selectedBrands]);

  const getLocalizedCategoryLabel = useCallback(
    (category: string) => {
      const normalized = category.trim().toLowerCase();
      if (normalized === "others") return t("others");

      const map: Record<string, { en: string; ge: string }> = {
        bundle: { en: "Bundle", ge: "კომპლექტი" },
        pillow: { en: "Pillow", ge: "ბალიში" },
        mattress: { en: "Mattress", ge: "მატრასი" },
        bed: { en: "Bed", ge: "საწოლი" },
        quilt: { en: "Quilt", ge: "საბანი" },
      };

      const label = map[normalized] || { en: category, ge: category };
      return locale === "en" ? label.en : label.ge;
    },
    [locale, t]
  );

  const labels = useMemo(
    () => ({
      filter: t("title"),
      categories: t("categories.title"),
      brands: t("brand.title"),
      priceRange: t("priceRange.title"),
      clearFilters: t("clearFilters"),
      search: t("search"),
      searchPlaceholder: t("searchPlaceholder"),
    }),
    [t]
  );

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
        const prices = data
          .flatMap((product: any) =>
            product.sizes?.map((s: any) => parseFloat(s.price)) || []
          )
          .filter((p: number) => !isNaN(p));
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
    if (isMounted) fetch();
  }, [isMounted]);

  const handleFilterChange = useCallback(() => {
    if (onFilterChange && isMounted) {
      onFilterChange({
        selectedCategories,
        selectedBrands,
        priceRange: currentPriceRange,
      });
    }
  }, [selectedCategories, selectedBrands, currentPriceRange, onFilterChange, isMounted]);

  useEffect(() => {
    if (isMounted) handleFilterChange();
  }, [handleFilterChange, isMounted]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handlePriceChange = (type: "min" | "max", value: number) => {
    setCurrentPriceRange((prev) => ({ ...prev, [type]: value }));
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setCurrentPriceRange(priceRange);
    setSearchQuery("");
    if (onFilterChange && isMounted) {
      onFilterChange({
        selectedCategories: [],
        selectedBrands: [],
        priceRange: priceRange,
      });
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("query", searchQuery.trim());
    if (selectedCategories.length > 0) params.set("cat", selectedCategories.join(","));
    if (selectedBrands.length > 0) params.set("brand", selectedBrands.join(","));
    const url = `/list${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(url);
    toggleSidebar();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClose = () => {
    toggleSidebar();
    document.body.style.overflow = "auto";
  };

  useImperativeHandle(ref, () => ({
    clearFilters,
  }));

  return (
    <>
      {isOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 z-[1] md:hidden"
        />
      )}

      <div
        className={`
          fixed md:static
          top-0 left-0 mt-14 md:mt-0
          h-screen md:h-auto
          w-60 md:w-80
          bg-white shadow-lg z-30
          overflow-y-auto pb-10
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex justify-between items-center p-4 border-b mt-10 md:mt-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">{labels.filter}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 transition-colors md:hidden"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <h3 className="text-[18px] font-semibold mb-3">{labels.search}</h3>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={labels.searchPlaceholder}
                className="w-full px-4 py-2 pl-10 border-2 border-gray-200 rounded-lg text-gray-800 placeholder-gray-400"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[18px] font-semibold mb-3">{labels.categories}</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <label key={category} className="flex items-center text-[14px]">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="mr-3"
                    />
                    {getLocalizedCategoryLabel(category)}
                  </label>
                ))
              ) : (
                <p className="text-[14px] text-gray-500 italic">No categories found</p>
              )}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-[18px] font-semibold mb-3">{labels.brands}</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <label key={brand} className="flex items-center text-[14px]">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="mr-3"
                    />
                    {brand}
                  </label>
                ))
              ) : (
                <p className="text-[14px] text-gray-500 italic">No brands found</p>
              )}
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="text-[18px] font-semibold mb-3">{labels.priceRange}</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                value={currentPriceRange.min}
                onChange={(e) =>
                  handlePriceChange("min", parseInt(e.target.value) || 0)
                }
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                value={currentPriceRange.max}
                onChange={(e) =>
                  handlePriceChange("max", parseInt(e.target.value) || 0)
                }
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="text-xs text-gray-500">
              ₾{currentPriceRange.min} - ₾{currentPriceRange.max}
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-white sticky bottom-0">
          <button
            onClick={handleSearch}
            className="w-full px-4 py-2 text-[20px] font-bold text-white bg-[#438c71] rounded-lg hover:bg-[#3a7a5f]"
          >
            {labels.search}
          </button>
          <button
            onClick={clearFilters}
            className="w-full mt-4 px-4 py-2 text-[20px] font-bold text-[#438c71] bg-white border-2 border-[#438c71] rounded-lg hover:bg-[#438c71] hover:text-white"
          >
            {labels.clearFilters}
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;
