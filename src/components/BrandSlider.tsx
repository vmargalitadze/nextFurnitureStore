"use client";
import React from "react";

import { useTranslations } from "next-intl";
import BrandItem from "./BrandItem";

// Import logo images
import one from "../../public/logos/1.png";
import two from "../../public/logos/2.png";

import four from "../../public/logos/4.png";
import five from "../../public/logos/5.png";
import six from "../../public/logos/6.png";

const logos = [
  { src: one.src, name: "Sevyat", type: "sevyat" },
  { src: two.src, name: "idaş", type: "idaş" },
  { src: four.src, name: "İsbiryatak", type: "isbiryatak" },
  { src: five.src, name: "SleepNice", type: "sleepnice" },

  { src: six.src, name: "SleepAndBed", type: "sleepandbed" },
];

function BrandSlider() {
  const t = useTranslations("brands");

  return (
    <section className=" bg-lightdark from-gray-50 to-white">
      <div className="container mx-auto py-10 px-4">
   

        {/* Brands Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

          {/* Brands Slider */}
          <div className="overflow-hidden">
            <BrandItem
              images={logos.map((logo) => logo.src)}
              brands={logos}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandSlider;
