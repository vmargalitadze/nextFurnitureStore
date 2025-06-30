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

    const path = pathname.includes("/list") ? pathname : "/list";

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
    <div className="relative inline-block h-[40px] w-full max-w-xs">
      <div
        className={`
        inline-flex items-center gap-2 h-[40px] w-full px-4 py-2 
        rounded-full bg-white/70 backdrop-blur-md 
        text-black font-semibold  
        ${isFocused ? "" : ""}
      `}
      >
        {/* Search Icon */}
        <div className="w-5 h-5 text-gray-500 flex items-center justify-center">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>

        {/* Input */}
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          type="text"
          placeholder={t("placeholder") || "Search products..."}
          className="
          flex-1 bg-transparent outline-none border-none 
          text-sm text-black placeholder-black placeholder:text-[16px]
          font-medium
        "
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={clearSearch}
            className="text-white hover:text-[#438c71] transition-colors duration-200 rounded-full"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isFocused && query && (
        <div className="absolute z-20 left-0 right-0 mt-2 w-full rounded-xl  shadow-2xl bg-white/90 backdrop-blur-xl transition-all duration-200">
          <div className="p-3">
            <div className="text-[18px] text-gray-500 mb-2">
              Search suggestions for &ldquo;{query}&rdquo;
            </div>
            <div className="space-y-1">
              <button 
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("query", query);
                  params.set("cat", "MATTRESS");
                  push(`/list?${params.toString()}`);
                }}
                className="w-full text-left px-3 py-2 rounded cursor-pointer text-sm hover:bg-gray-100"
              >
                {query} in mattresses
              </button>
              <button 
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("query", query);
                  params.set("cat", "PILLOW");
                  push(`/list?${params.toString()}`);
                }}
                className="w-full text-left px-3 py-2 rounded cursor-pointer text-sm hover:bg-gray-100"
              >
                {query} in pillows
              </button>
              <button 
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("query", query);
                  params.set("cat", "QUILT");
                  push(`/list?${params.toString()}`);
                }}
                className="w-full text-left px-3 py-2 rounded cursor-pointer text-sm hover:bg-gray-100"
              >
                {query} in quilts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchBar() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md h-12 bg-gray-100 rounded-full " />
      }
    >
      <SearchHelper />
    </Suspense>
  );
}
