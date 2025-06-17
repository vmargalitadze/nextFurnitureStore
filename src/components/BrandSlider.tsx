"use client";
import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import BrandItem from './BrandItem';

// Import logo images
import one from '../../public/logos/1.png';
import two from '../../public/logos/2.png';
import three from '../../public/logos/3.png';
import four from '../../public/logos/4.png';
import five from '../../public/logos/5.png';
import six from '../../public/logos/6.png';

const logos = [
  { src: one.src, name: 'Sevyat', type: 'sevyat' },
  { src: two.src, name: 'İDAŞ', type: 'idas' },
  { src: three.src, name: 'İsbiryatak', type: 'isbiryatak' },
  { src: four.src, name: 'SleepNice', type: 'sleepnice' },
  { src: five.src, name: 'Brand 5', type: 'brand5' },
  { src: six.src, name: 'SleepAndBed Georgia', type: 'sleepandbed-georgia' },
];

function BrandSlider() {
  const t = useTranslations('brands');

  return (
    <section className=" bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Brands Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
          
          {/* Brands Slider */}
          <div className="overflow-hidden">
            <BrandItem 
              images={logos.map(logo => logo.src)} 
              from={0} 
              to="-100%"
              brands={logos}
            />
          </div>
        </div>

      
      </div>
    </section>
  );
}

export default BrandSlider;
