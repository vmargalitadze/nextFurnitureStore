
import React from "react";
import Products from "@/lib/product"
import Link from "next/link";
import ProductHelper from "./ProductHelper";

interface ProductItem {
  id: string;
  image: string;
  price: number;
  label: string;
}

interface ProductListProps {
  items: ProductItem[]; 
}


function ProductList() {
  const items = Products.slice(0, 4)
  
  return (
    <>
  <div className="s-py-100-50">
        <div className="container mx-auto">
          <div className="flex justify-center items-center mb-[40px] md:mb-12 ">
            <div>
              <span className="text-primary font-secondary font-normal text-4xl md:text-[60px] block -ml-5 -mb-3 sm:-mb-[30px] leading-normal sm:leading-normal">
                ახალი
              </span>
              <h6 className="font-normal leading-none tracking-[.5em] lg:mt-4 sm:tracking-[1em] uppercase">
                პროდუქტები
              </h6>
            </div>
          </div>
        <ProductHelper items={items} />

          <div className="text-center mx-auto mt-7 md:mt-12">
            <Link
              className="btn-all btn-outline"
              href="/all"
              data-discover="true"
            >
              <span>ნახე ყველა პროდუქტი</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductList;
