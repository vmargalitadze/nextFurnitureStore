"use client";
import CategoriesList from "./CategoriesList";
import Products from '@/lib/product';
interface FilterProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    setSelectedType: (type: string) => void;
    selectedType: string;
    selectedBrand: string;
    setSelectedBrand: (brand: string) => void;
    selectedPrice: { min: number | null, max: number | null };
    setSelectedPrice: (price: { min: number | null, max: number | null }) => void;
}

const Filter = ({
 
    setSelectedType,
    selectedType,
    selectedBrand,
    setSelectedBrand,
    selectedPrice,
    setSelectedPrice,
}: FilterProps) => {
  const BrandFilter = Array.from(new Set(Products.map((product) => product.Brand)));
    const handleCategoryChange = (type: string) => {
        setSelectedType(type);
   
    };

    const handleBrandChange = (brand: string) => {
        setSelectedBrand(brand);
      
    };

    const handlePriceChange = (minPrice: number | null, maxPrice: number | null) => {
        setSelectedPrice({ min: minPrice, max: maxPrice });
     
    };

    

    return (
        <>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 max-w-[1720px] mx-auto border-b border-bdr-clr border-bdr-clr-drk pb-8 ">
                <div>
                    <h4 className="font-medium leading-none text-xl sm:text-2xl mb-5 sm:mb-6">აირჩიე კატეგორია</h4>
                    <div className="flex  justify-center flex-wrap gap-[10px] md:gap-[15px]">
                        <button
                            className={`btn-all rounded-md btn-outline ${selectedType === "" ? "bg-[#BB976D] text-white" : ""}`}
                            onClick={() => handleCategoryChange("")}
                            data-discover="true"
                        >
                            <span>ყველა</span>
                        </button>

                        {CategoriesList.map((item) => (
                            <button
                                key={item.id}
                                className={`btn-all rounded-md btn-outline ${selectedType === item.type ? "bg-[#BB976D] text-white" : ""}`}
                                onClick={() => handleCategoryChange(item.type)}
                                data-discover="true"
                            >
                                <span className="text-[18px]">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-[562px] w-full flex flex-col gap-8 md:gap-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-4">
                            <div className="text-lg font-medium text-title text-black">ფასი</div>
                            <div className="grid grid-cols-2 gap-[10px]">
                                <div className="py-[10px] px-3 border border-title border-white-light flex items-center gap-[5px]">
                                    <span className="text-title text-black font-medium leading-none">Min:</span>
                                    <input
                                        className="pl-[8px] w-full bg-transparent text-title text-black placeholder:text-title placeholder:text-white font-medium leading-none outline-none"
                                        type="number"
                                        value={selectedPrice.min ?? ""}
                                        onChange={(e) => handlePriceChange(e.target.value === "" ? null : Number(e.target.value), selectedPrice.max)}
                                        placeholder="0"
                                    />
                                </div>

                                <div className="py-[10px] px-3 border border-title border-white-light flex items-center gap-[5px]">
                                    <span className="text-title text-black font-medium leading-none">Max:</span>
                                    <input
                                        className="pl-[8px] w-full bg-transparent text-title text-black placeholder:text-title placeholder:text-white font-medium leading-none outline-none"
                                        type="number"
                                        value={selectedPrice.max ?? ""}
                                        onChange={(e) => handlePriceChange(selectedPrice.min, e.target.value === "" ? null : Number(e.target.value))}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
        <div className="text-lg font-medium text-title text-black">ბრენდი</div>
        <div className="relative">
            <select
                className="w-full appearance-none py-3 px-4 border border-title border-white-light bg-white bg-dark text-titletext-white font-medium leading-none rounded-md outline-none"
                value={selectedBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
            >
                <option value="">აირჩიე ბრენდი</option>
                {BrandFilter.map((brand) => (
                    <option key={brand} value={brand}>
                        {brand}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-title text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>
                    </div>
                </div>
            </div>

            <div className="pt-3 pb-3">
                <span className="w-full border-t border-dotted border-blue-dark"></span>
            </div>
        </>
    );
};

export default Filter;
