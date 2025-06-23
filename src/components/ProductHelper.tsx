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
    <div className="max-w-7xl mt-10 mx-auto">
      
      <div className="w-full relative">
        <Swiper
          modules={[Autoplay, FreeMode]}
          spaceBetween={20}
          slidesPerView={1}
          freeMode={true}
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
              <div className="relative z-1 h-full group flex flex-col items-center justify-between py-2">
                <div className="overflow-hidden rounded-3xl w-full">
                  <Link href={`/products/${item.id}`}>
                    <Image
                      src={item.image[0]}
                      alt={getLocalizedTitle(item, locale)}
                      width={192}
                      height={192}
                      priority={index < 8}
                      loading={index < 8 ? "eager" : "lazy"}
                      className="w-full rounded-3xl duration-500 group-hover:-translate-y-5 object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      quality={85}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  </Link>
                </div>
                <div className="py-3 w-full flex flex-col items-center">
                  <h6 className="w-[70%] max-xl:w-full text-center text-base font-semibold text-gray-800">
                    <Link href={`/products/${item.id}`}>
                      {getLocalizedTitle(item, locale)}
                    </Link>
                  </h6>
                  <span className="mt-2 text-primary font-bold text-lg">
                    ₾{item.price}
                  </span>
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