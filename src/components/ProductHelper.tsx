import { Link } from "@/i18n/navigation";
import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface ProductItem {
  id: string;
  image: string[];
  price: number;
  originalPrice?: number;
  sales?: number;
  title: string;
  titleEn?: string;
}

interface ProductListProps {
  items: ProductItem[];
}

const getLocalizedTitle = (product: ProductItem, locale: string): string => {
  if (locale === "en") {
    return product.titleEn ?? product.title;
  }
  return product.title ?? product.titleEn ?? "";
};

function ProductHelper({ items }: ProductListProps) {
  const locale = useLocale();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
  
      <div className="hidden md:block">
        <div className="grid grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item.id} className="mb-6">
              <div className="relative group overflow-hidden rounded-lg  shadow-lg  hover:shadow-xl transition-all duration-300">
                <Link href={`/products/${item.id}`}>
                  <div className="relative h-[200px] w-full">
                    <Image
                      src={item.image[0]}
                      alt={getLocalizedTitle(item, locale)}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="py-3 text-center font-semibold">
                    {getLocalizedTitle(item, locale)}
                  </div>
                  <div className="text-center font-bold text-gray-900">
                    ₾{item.price.toFixed(2)}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="md:hidden relative">
        {/* Arrow Buttons */}
        <div className="absolute top-1/2 left-0 z-10 -translate-y-1/2">
          <button className="swiper-button-prev-mobile text-black bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center shadow">
            ‹
          </button>
        </div>
        <div className="absolute top-1/2 right-0 z-10 -translate-y-1/2">
          <button className="swiper-button-next-mobile text-black bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center shadow">
            ›
          </button>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".swiper-button-next-mobile",
            prevEl: ".swiper-button-prev-mobile",
          }}
          slidesPerView={1}
          spaceBetween={16}
          className="pb-12"
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <div className=" py-3">
                <div className="relative group rounded-xl overflow-hidden  shadow-lg  hover:shadow-xl transition-all duration-300">
                  <Link href={`/products/${item.id}`}>
                    <div className="relative h-[200px] w-full">
                      <Image
                        src={item.image[0]}
                        alt={getLocalizedTitle(item, locale)}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                    <div className="py-3 text-center font-semibold">
                      {getLocalizedTitle(item, locale)}
                    </div>
                    <div className="text-center font-bold text-gray-900">
                      ₾{item.price.toFixed(2)}
                    </div>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}

export default ProductHelper;
