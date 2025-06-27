import { Link } from "@/i18n/navigation";
import React from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";

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
  if (locale === 'en') {
    return product.title ?? product.titleEn;
  }
  return product.title ?? product.titleEn ?? '';
};

function ProductHelper({ items }: ProductListProps) {
  const t = useTranslations();
  const locale = useLocale();

  if (!items || items.length === 0) {
    return null;
  }
  return (
    <div className="max-w-7xl  mx-auto">

      <div className="w-full  relative">
        <Swiper
          modules={[Autoplay, FreeMode]}
          spaceBetween={20}
          slidesPerView={1}
          freeMode={true}
          
          watchSlidesProgress={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
          className="product-swiper w-full"
        >
          {items.map((item, index) => (
            <SwiperSlide key={item.id}>
              <div className="relative h-[250px] wow fadeInUp z-1  group flex flex-col items-center justify-between py-2 cursor-pointer overflow-visible">
                <div className="overflow-visible rounded-2xl w-full">
                <div className="relative overflow-visible rounded-2xl w-full group">
  <Link href={`/products/${item.id}`}>
    <div className="relative z-10 transition-all group-hover:shadow-1xl duration-500 ">
      <Image
        src={item.image[0]}
        alt={getLocalizedTitle(item, locale)}
        width={192}
        height={192}
        priority={index === 0}
        loading={index < 8 ? "eager" : "lazy"}
        className="w-full rounded-3xl object-cover transition-all group-hover:shadow-2xl duration-500 "
      />
    </div>
  </Link>
</div>

</div>
                <div className="py-3 w-full flex flex-col items-center transition-all duration-500 ">
                  <h6 className="w-[70%] max-xl:w-full text-center text-base font-semibold text-gray-800 transition-all duration-500 ">
                    <Link href={`/products/${item.id}`}>
                      {getLocalizedTitle(item, locale)}
                    </Link>
                  </h6>
                  
                  {/* Price Display */}
                  <div className="mt-2 text-center">
                    {item.sales && item.originalPrice ? (
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-600">
                            ₾{item.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ₾{item.originalPrice.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-xs text-red-600 font-medium">
                          -{item.sales}% OFF
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        ₾{item.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default ProductHelper;