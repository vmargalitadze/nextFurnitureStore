import Link from "next/link";
import React from "react";
import Image from "next/image";

interface ProductItem {
  id: string;
  image: string[];
  price: number;
  title: string;
}

interface ProductListProps {
  items: ProductItem[]; 
}


function ProductHelper({ items }: ProductListProps  ) {
    if (!items || items.length === 0) {
        return null; 
      }
  return (
   <>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
      {items.map((item) => (
        <div key={item.id}>
         <div className="relative overflow-hidden group">
              <Link href={`/products/${item.id}`} >
                <Image
                  width={100}
                  height={100}
                  className="w-full transform duration-300 group-hover:scale-110"
                  alt="product-card"
                  src={item.image[0]}
                />
              </Link>

              <div className="flex flex-col items-start gap-3 md:gap-4 absolute z-20 w-11/12 bottom-3 xl:bottom-5 left-1/2 transform -translate-x-1/2 p-4 xl:p-5 bg-white bg-title  bg-opacity-[85%] group-hover:-translate-y-1/2 duration-500 group-hover:opacity-0 group-hover:invisible">
                <h4 className="font-medium leading-none text-black text-lg">
                  {item.price}₾ 
                </h4>
                <h5 className="font-normal text-black text-paragraph leading-[1.5]">
                  <Link href="/product-details" className="text-2xl" data-discover="true">
                    {item.title}
                  </Link>
                </h5>
              </div>

              <div className="absolute z-10 flex gap-2 justify-center bottom-5 md:bottom-7 w-full transform translate-y-5 opacity-0 duration-500 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible">
                <button className="icon-button relative w-9 lg:w-12 h-9 p-2 lg:h-12 bg-white bg-title bg-opacity-80 flex items-center justify-center rounded-full">
                  <Image src="/cart.png" alt="" width={22} height={22} />
                  <span className="tooltip">
                    დაამატე კალათაში
                    <span className="tooltip-arrow"></span>
                  </span>
                </button>
                <Link
                  href={`/products/${item.id}`}
                  className="icon-button relative w-9 lg:w-12 h-9 p-2 lg:h-12 bg-white bg-title bg-opacity-80 flex items-center justify-center rounded-full"
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-black h-[22px] w-[20px]"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span className="tooltip">
                    დეტალები
                    <span className="tooltip-arrow"></span>
                  </span>
                </Link>
              </div>
            </div>
        </div>
      ))}
    </div>
   
   </>
  )
}

export default ProductHelper