import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { Link } from "@/i18n/navigation";

interface BrandData {
  src: string;
  name: string;
  type: string;
}

interface BrandItemProps {
  images: string[];
  from: number | string;
  to: number | string;
  brands?: BrandData[];
}

function BrandItem({ images, from, to, brands }: BrandItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  // Use provided brands data or fallback to images with default names
  const brandData = brands || images.map((image, index) => ({
    src: image,
    name: `Brand ${index + 1}`,
    type: `brand${index + 1}`
  }));

  useEffect(() => {
    if (isHovered) {
      controls.stop();
    } else {
      controls.start({
        x: to,
        transition: {
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 0,
        },
      });
    }
  }, [isHovered, controls, to]);

  return (
    <div 
      className="relative overflow-hidden "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={{ x: from }}
        animate={controls}
        className="flex items-center space-x-16"
      >
        {[...brandData, ...brandData].map((brand, index) => (
          <Link 
            key={`${brand.type}-${index}`}
            href={`/list?brand=${brand.type}`}
            className="flex-shrink-0 group"
            data-discover="true"
          >
            <div className="relative w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-28 lg:w-56 lg:h-32 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-100">
              <Image
                src={brand.src}
                alt={`${brand.name} logo`}
                fill
                className="object-contain p-4 group-hover:filter group-hover:brightness-110 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}

export default BrandItem;
