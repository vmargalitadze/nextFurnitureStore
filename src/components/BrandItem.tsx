/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import { motion } from 'framer-motion';

function BrandItem({ images, from, to }: { images: string[]; from: number | string; to: number | string }) {
  return (
    <div className="overflow-hidden w-full py-10 MyGradient">
      <motion.div
        initial={{ x: from }}
        animate={{ x: to }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="flex flex-shrink-0"
      >
        {images.map((image, index) => (
          <img
            className="h-20 sm:h-28 md:h-32 lg:h-40 w-auto px-6 object-contain"
            src={image}
            alt={`Logo ${index}`}
            key={index}
          />
        ))}
        {images.map((image, index) => (
          <img
            className="h-20 sm:h-28 md:h-32 lg:h-40 w-auto px-6 object-contain"
            src={image}
            alt={`Logo copy ${index}`}
            key={`copy-${index}`}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default BrandItem;
