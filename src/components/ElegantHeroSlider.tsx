"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  // Auto-advance disabled as requested
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     nextSlide();
  //   }, 8000);

  //   return () => clearInterval(interval);
  // }, []);

           return (
      <section className="relative 
     min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[600px] mt-16 sm:mt-20 md:mt-24 overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12">
   

       {/* Main Slider Container */}
       <div className="relative max-w-7xl mx-auto h-full min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex"
          >
                         {/* Left Section */}
             <motion.div
               initial={{ x: -100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 0.6, ease: "easeOut" }}
               className="w-full sm:w-[48%] rounded-xl sm:rounded-2xl relative overflow-hidden"
             >
               <div 
                 className="w-full rounded-xl sm:rounded-2xl h-full bg-cover bg-center bg-no-repeat"
                 style={{
                   backgroundImage: `url('${slides[currentSlide].leftImage}')`,
                 }}
               />
               <div className="absolute inset-0 bg-black/10" />
             </motion.div>

             {/* Center Spacing - Hidden on mobile */}
             <div className="hidden sm:block w-[4%] flex items-center justify-center">
               <div className="w-px h-32 bg-neutral-300/50"></div>
             </div>

             {/* Right Section */}
             <motion.div
               initial={{ x: 100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 0.6, ease: "easeOut" }}
               className="w-full sm:w-[48%] rounded-xl sm:rounded-2xl relative overflow-hidden"
             >
               <div 
                 className="w-full rounded-xl sm:rounded-2xl h-full bg-cover bg-center bg-no-repeat"
                 style={{
                   backgroundImage: `url('${slides[currentSlide].rightImage}')`,
                 }}
               />
               <div className="absolute inset-0 bg-black/10" />
             </motion.div>
          </motion.div>
        </AnimatePresence>

                 {/* Central Promotional Overlay */}
         <motion.div
           initial={{ opacity: 0, y: 30, scale: 0.9 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.3 }}
           className="absolute inset-0 flex items-center justify-center z-20 px-4"
         >
          <div className="bg-neutral-50/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl border border-neutral-200 w-full max-w-xs sm:max-w-sm md:max-w-md text-center">
                         <AnimatePresence mode="wait">
               <motion.div
                 key={currentSlide}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ duration: 0.5 }}
                 className="flex flex-col sm:block"
               >
                                 <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-neutral-800 mb-3 sm:mb-4 leading-tight">
                 შენი ღამე, შენი კომფორტი
                 </h1>
                 <p className="text-sm sm:text-base md:text-lg lg:text-xl font-serif italic text-neutral-600 mb-6 sm:mb-8">
                 ყველაფერი, რაც გჭირდება მშვიდი და ჯანსაღი ძილისთვის
                 </p>
                 <button className="bg-neutral-900 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full font-medium hover:bg-neutral-800 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base">
                  დავიწყოთ შოპინგი
                 </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

                 {/* Navigation Arrows */}
         <motion.button
           onClick={prevSlide}
           className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-800 transition-all duration-300 hover:scale-110 shadow-lg"
           whileHover={{ scale: 1.1 }}
           whileTap={{ scale: 0.95 }}
         >
           <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
         </motion.button>

         <motion.button
           onClick={nextSlide}
           className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-800 transition-all duration-300 hover:scale-110 shadow-lg"
           whileHover={{ scale: 1.1 }}
           whileTap={{ scale: 0.95 }}
         >
           <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
         </motion.button>

      
      </div>

    

             {/* Floating Accent Elements */}
       <motion.div
         className="absolute top-10 sm:top-16 md:top-20 right-4 sm:right-12 md:right-20 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-amber-100/30 rounded-full blur-2xl"
         animate={{
           scale: [1, 1.2, 1],
           opacity: [0.3, 0.6, 0.3],
         }}
         transition={{
           duration: 6,
           repeat: Infinity,
           ease: "easeInOut",
         }}
       />
       
       <motion.div
         className="absolute bottom-10 sm:bottom-16 md:bottom-20 left-4 sm:left-12 md:left-20 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-neutral-200/30 rounded-full blur-2xl"
         animate={{
           scale: [1, 1.3, 1],
           opacity: [0.2, 0.5, 0.2],
         }}
         transition={{
           duration: 8,
           repeat: Infinity,
           ease: "easeInOut",
           delay: 2,
         }}
       />
    </section>
  );
};

export default ElegantHeroSlider;
