"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import Image from "next/image";

const imageVariants = {
  exit: { opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.4 } },
  enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
};

function ProductImage({ image }: { image: string[] }) {
  const [current, setCurrent] = useState(0);

  return (
    <section className="w-full">
      <div className="flex flex-col lg:grid lg:grid-cols-[3fr_auto] gap-4 items-start">
        
        {/* Main Image */}
        <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-lg">
          <motion.div
            key={current}
            initial="exit"
            animate="enter"
            exit="exit"
            variants={imageVariants}
            className="w-full h-full"
          >
            <Image
              src={image[current]}
              alt="main-image"
              fill
              className="object-cover rounded-xl"
              priority
            />
          </motion.div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex lg:flex-col gap-3 justify-center items-center overflow-x-auto w-full py-2 lg:w-auto lg:py-0">
          {image.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`relative w-16 h-16 lg:w-20 lg:h-20 border-2 rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 shrink-0 ${
                current === index 
                  ? 'border-primary shadow-lg' 
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <Image
                src={img}
                alt={`thumbnail-${index}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductImage;
