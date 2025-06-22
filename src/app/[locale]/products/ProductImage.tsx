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
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50">
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
              className="object-cover"
              priority
            />
          </motion.div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex justify-center gap-4 mt-6">
          {image.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                current === index 
                  ? 'ring-2 ring-gray-900' 
                  : 'hover:opacity-80'
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
