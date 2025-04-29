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
  <div className="flex flex-col md:grid md:grid-cols-[1fr_auto] gap-2 items-start">
    
    {/* Main Image */}
    <div className="relative w-full h-[60vh] md:h-[80vh] rounded-xl overflow-hidden">
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
        />
      </motion.div>
    </div>

 
    <div className="flex md:flex-col gap-2 justify-center scrollbar-none items-center overflow-x-auto  w-full py-2 md:w-auto">
      {image.map((img, index) => (
        <button
          key={index}
          onClick={() => setCurrent(index)}
          className="relative w-20 h-20 border-2 rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 shrink-0"
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
