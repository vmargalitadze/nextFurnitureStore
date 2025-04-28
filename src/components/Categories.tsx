"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay} from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/react";
import CategoriesList from "./CategoriesList";
function Categories() {
  return (
    <>
<div className="s-py-100-50">
  <div className="mx-auto">
    <div className="flex justify-center items-center mb-[40px] md:mb-[52px]">
      <div>
        <span className="text-primary font-secondary font-normal text-4xl sm:text-7xl block sm:-mb-[30px] leading-normal sm:leading-normal">
          კატეგორიები
        </span>
      </div>
    </div>

 
    <Swiper

  slidesPerView={1}  

  autoplay={{
    delay: 3000,  
    disableOnInteraction: false, 
  }}
  modules={[ Autoplay]}
  breakpoints={{
    640: {
      slidesPerView: 1, 
    },
    768: {
      slidesPerView: 2, 
    },
    1024: {
      slidesPerView: 4,  
    },
  }}

  grabCursor={true} 
>
  {CategoriesList.map((item) => (
    <SwiperSlide key={item.id}>

      <div className="w-full">
        <Link className="relative" href={`/list?cat=${item.type}`} data-discover="true">
          <Image
            src={item.image}
            alt="category image"
            width={380}
            height={380}
            className="w-full"
          />
          <div className="absolute bottom-7 left-0 px-5 transform w-full flex justify-center">
            <div className="min-w-[250px] bg-white bg-opacity-80 dark:bg-title dark:bg-opacity-80 p-5 z-10">
              <h4 className="leading-[1.5] font-semibold"> {item.label} </h4>
              <p className="leading-none mt-[10px]">222</p>
            </div>
          </div>
        </Link>
      </div>
    </SwiperSlide>
  ))}
</Swiper>


  </div>
</div>

    </>
  );
}

export default Categories;
