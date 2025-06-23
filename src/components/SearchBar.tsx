"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Suspense, useEffect, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

function SearchHelper() {
  const searchParams = useSearchParams();
  const { replace, push } = useRouter();
  const pathname = usePathname();
  const t = useTranslations("search");

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term: string) => {
    setIsSearching(true);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    const path = pathname.includes("/all") ? pathname : "/all";

    if (pathname !== path) {
      push(`${path}?${params.toString()}`);
    } else {
      replace(`${path}?${params.toString()}`);
    }
    
    // Simulate search delay for better UX
    setTimeout(() => setIsSearching(false), 500);
  }, 300);

  const clearSearch = () => {
    setQuery("");
    handleSearch("");
  };

  return (
    <div className="relative w-full max-w-md">
      <div className={`
        relative flex items-center 
        bg-white border-2 rounded-full 
        transition-all duration-300 ease-in-out
        ${isFocused 
          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
          : 'border-gray-200 hover:border-gray-300'
        }
        ${query ? 'pr-12' : 'pr-4'}
      `}>
        {/* Search Icon */}
        <div className="flex items-center justify-center w-12 h-12 pl-4">
          {isSearching ? (
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          ) : (
            <Search className={`h-5 w-5 transition-colors duration-200 ${
              isFocused ? 'text-blue-500' : 'text-gray-400'
            }`} />
          )}
        </div>

        {/* Input Field */}
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          name="search"
          type="text"
          className="
            flex-1 h-12 px-2 
            bg-transparent outline-none 
            text-gray-900 placeholder-gray-500
            text-sm font-medium
            transition-all duration-200
            placeholder:text-[16px]
          "
          placeholder={t('placeholder') || "Search products..."}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={clearSearch}
            className="
              absolute right-2 p-2 
              text-gray-400 hover:text-gray-600
              transition-colors duration-200
              rounded-full hover:bg-gray-100
            "
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Suggestions (Optional) */}
      {isFocused && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3">
            <div className="text-sm text-gray-500 mb-2">
              Search suggestions for &ldquo;{query}&rdquo;
            </div>
            <div className="space-y-1">
              <div className="px-3 py-2 hover:bg-gray-50 rounded cursor-pointer text-sm">
                {query} in mattresses
              </div>
              <div className="px-3 py-2 hover:bg-gray-50 rounded cursor-pointer text-sm">
                {query} in pillows
              </div>
              <div className="px-3 py-2 hover:bg-gray-50 rounded cursor-pointer text-sm">
                {query} in quilts
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md h-12 bg-gray-100 rounded-full animate-pulse" />
    }>
      <SearchHelper />
    </Suspense>
  );
}