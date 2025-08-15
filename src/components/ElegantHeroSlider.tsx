"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface Slide {
  id: number;
  leftImage: string;
  rightImage: string;
  leftAlt: string;
  rightAlt: string;
  title: string;
  subtitle: string;
  ctaText: string;
}

const ElegantHeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      leftImage: "/slider/1.jpg",
      rightImage: "/slider/2.jpg",
      leftAlt: "Modern hallway with wooden panels and natural light",
      rightAlt: "Elegant bathroom vanity with marble tiles",
      title: "TRANSFORM YOUR SPACE WITH ELEGANCE",
      subtitle: "For the Modern Home.",
      ctaText: "DISCOVER OUR BATHROOM"
    },
    {
      id: 2,
      leftImage: "/slider/2.jpg",
      rightImage: "/slider/3.jpg",
      leftAlt: "Contemporary living space with clean lines",
      rightAlt: "Modern bedroom with premium furniture",
      title: "CREATE YOUR DREAM INTERIOR",
      subtitle: "Where Style Meets Comfort.",
      ctaText: "EXPLORE COLLECTION"
    },
    {
      id: 3,
      leftImage: "/slider/3.jpg",
      rightImage: "/slider/1.jpg",
      leftAlt: "Luxury bedroom with elegant furnishings",
      rightAlt: "Sophisticated dining area with natural materials",
      title: "ELEVATE YOUR LIFESTYLE",
      subtitle: "Timeless Design, Modern Living.",
      ctaText: "VIEW GALLERY"
    }
  ];

  const nextSlide = () => {
    if (currentSlide === slides.length - 1) {
      setCurrentSlide(0);
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide === 0) {
      setCurrentSlide(slides.length - 1);
    } else {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };



  return (
    <section className="relative 
     min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] mt-16 sm:mt-20 md:mt-24 overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12">

      {/* Main Slider Container */}
      <div className="relative max-w-7xl mx-auto h-full min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Single Large Image */}
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="w-full h-full rounded-2xl sm:rounded-3xl relative overflow-hidden"
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat rounded-2xl sm:rounded-3xl"
                style={{
                  backgroundImage: `url('${slides[currentSlide].leftImage}')`,
                }}
              />
              {/* Enhanced Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
              
            
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Central Promotional Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute inset-0 flex items-start justify-start z-20 px-4 sm:px-6 md:px-8 lg:px-12 pt-16 sm:pt-20 md:pt-24"
        >
          <div className="max-w-lg sm:max-w-xl md:max-w-2xl text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-start"
              >
                <h1 className=" md:text-[38px] text-[24px]  font-serif font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl">
                  ძილი, რომელიც იმსახურებ
                </h1>
                
                <p className=" md:text-[20px] text-[18px] font-serif italic text-black mb-8 sm:mb-10 max-w-lg leading-relaxed drop-shadow-lg">
                  ჩვენი პროდუქტი შექმნილია მაქსიმალური კომფორტისა და ხარისხისთვის, რომ ყოველი დილა იყოს სასიამოვნო
                </p>
                
                <Link 
                  href="/list" 
                 className=" text-center  bg-[#f3983e] md:text-[20px] text-[18px] w-full md:w-[40%] border-radius:20px  px-4 sm:px-6 md:px-8 py-2 text-black  rounded-xl font-bold  transition-all duration-300 transform shadow-lg "
                >
                  შეიძინე ახლა
                
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

      

     

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-[#f3983e] scale-110' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Floating Accent Elements */}
      <motion.div
        className="absolute top-16 sm:top-20 md:top-24 right-8 sm:right-16 md:right-24 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-[#f3983e]/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-8 sm:left-16 md:left-24 w-16  sm:h-20 md:w-28 md:h-28 bg-[#f3983e]/15 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.15, 0.4, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />
    </section>
  );
};

export default ElegantHeroSlider;
