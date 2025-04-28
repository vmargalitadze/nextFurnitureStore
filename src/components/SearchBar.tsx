"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Image from "next/image";
import { useEffect, useState } from "react";


function SearchBar() {
  const searchParams = useSearchParams();
  const { replace, push } = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState(searchParams.get("query") || "");

  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term: string) => {
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
  }, 300);
  return (
   <div className='flex items-center justify-between gap-4 bg-gray-100 p-2 rounded-md flex-1'>
    <input value={query}  onChange={(e) => {
    setQuery(e.target.value);
    handleSearch(e.target.value);
  }} name='name' type='text' className="flex-1 bg-transparent outline-none" placeholder='Search' />
    <button className='cursor-pointer' > <Image src='/search.png' width={16} height={16} alt='search'/></button>
   </div>
  )
}

export default SearchBar