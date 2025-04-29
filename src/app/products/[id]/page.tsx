"use client";
import Link from "next/link";
import React, { useState } from "react";
import Products from "@/lib/product";
import ProductImage from "../ProductImage";
const Page = (props: { params: { id: string; locale: string } }) => {
  const { id, locale } = props.params;
  const product = Products.find((prod) => prod.id === id);
  let [count, setCount] = useState(0);
  if (!product) {
    return (
      <div className="text-center text-lg font-bold">Product not found</div>
    );
  }
  function incrementCount() {
    setCount(prev => prev + 1);
  }
  
  function decrementCount() {
    setCount(prev => (prev > 0 ? prev - 1 : 0));
  }
  return (
    <>
      <div className="bg-[#F8F5F0] bg-dark-secondary py-5 md:py-[30px]">
        <div className="container">
          <ul className="flex items-center gap-[10px] text-base md:text-lg leading-none font-normal text-title text-black max-w-[1720px] mx-auto flex-wrap">
            <li>
              <Link href="/" data-discover="true">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary text-2xl"> {product.title} </li>
          </ul>
        </div>
      </div>
      <div className="s-py-100-50">
        <div className="container">
          <div className=" mx-auto  flex justify-between gap-6 lg:gap-8 flex-col lg:flex-row">
            <div className="w-full lg:w-[58%] ">
              <ProductImage image={product.image} />
            </div>
            <div className="lg:max-w-[635px]  w-full">
              <div className="pb-4 sm:pb-6 border-b border-bdr-clr border-bdr-clr-drk">
                <h2 className="font-semibold pb-5 text-3xl leading-none tracking-tight text-title text-black">
                  {product.title}
                </h2>

                <span className="text-2xl pb-5 sm:text-3xl  leading-none block">
               
                  ბრენდი: {product.Brand}
                </span>

                <span className="text-2xl pb-5 sm:text-3xl  leading-none block">
                 
                  ფასი: {product.price} ₾
                </span>

                <span className="text-2xl pb-5 sm:text-3xl  leading-none block">
                
                  რაოდენობა: 10 ცალი
                </span>

                <p className="text-base  pb-5 md:text-lg leading-6 font-normal text-title text-black mt-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Aliquid, hic. Dolores commodi nulla, assumenda sit nostrum
                  voluptatem eveniet, velit odio tempora placeat hic. Veniam
                  dolorum totam earum vitae nesciunt voluptatum.
                </p>
              </div>

              <div className="py-5 sm:py-6  ">
                <div className="flex items-center gap-3">
                  <div className="inc-dec flex items-center gap-2">
                    <div className="dec w-6 h-6 bg-[#E8E9EA] bg-dark-secondary flex items-center justify-center">
                    <button onClick={decrementCount}>-</button>
                     
                    </div>
                  </div>

                  <div>{count}</div>

                  <div className="inc w-6 h-6 bg-[#E8E9EA] bg-dark-secondary flex items-center justify-center">
                  <button onClick={incrementCount}>+</button>
                  </div>
                </div>

                <div className="flex gap-5 mt-4 sm:mt-6">
                  <button className="btn-all   text-black  btn-outline">
                    <span> Add to Cart </span>
                  </button>

                  <button className="btn-all btn-outline">
                    <span> Add to Washlist </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
