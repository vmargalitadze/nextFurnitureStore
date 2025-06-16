import { Link } from "@/i18n/navigation";
import React from "react";
import Image from "next/image";
function AboutPage() {
  return (
    <>
      <div className="relative min-h-[400px] flex items-center justify-center bg-overlay p-14 sm:p-16 before:bg-title before:bg-opacity-70 overflow-hidden">
        <Image
          src="/bed.jpg"
          alt="Background"
          fill
          quality={80}
          className="object-cover  z-0"
        />

        <div className="absolute inset-0 bg-black/60 z-10" />

        <div className="relative z-20 text-center w-full">
          <h2 className="text-white text-8 text-2xl md:text-[40px] font-normal leading-none text-center">
            About Us
          </h2>
          <ul className="flex items-center justify-center gap-[10px] text-base md:text-lg leading-none font-normal text-white mt-3 md:mt-4">
            <li>
              <Link href="/" data-discover="true">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary capitalize">About</li>
          </ul>
        </div>
      </div>

      <div className="pt-[70px]  pb-[70px]">
        <div className="container">
        
      <div className="max-w-[1720px] mx-auto grid grid-cols-1 lg:grid-cols-2 ">

      <div className="w-full h-full">
        <Image
          width={860}
          height={960}
          className="object-cover rounded-md w-full h-full"
          alt="about"
          src="/aboutbg.jpg"
        />
      </div>

    
      <div className="flex items-center py-8 sm:py-12 px-5 sm:px-12 md:px-8 lg:pr-12 lg:pl-16 2xl:pl-[160px] bg-[#F8F8F9] ">
      <div className="lg:max-w-[600px] text-center ">
                  <h3 className="font-medium leading-none mt-4 md:mt-6 text-2xl md:text-3xl">
                    About Us
                  </h3>
                  <p className="mt-3 text-base sm:text-lg">
                    At FurnXar, our story is one of passion, craftsmanship, and
                    a relentless pursuit of excellence. It all began with a
                    vision to redefine the way people experience furniture – not
                    just as functional pieces, but as expressions of personal
                    style and comfort. Driven by a love for design and a
                    commitment to quality, we embarked on a journey to create
                    furniture that transcends trends and stands the test of
                    time. Each piece in our collection tells a story of
                    meticulous attention to detail, from the selection of
                    premium materials to the precision of craftsmanship.
                  </p>
                  <p className="mt-3 text-base sm:text-lg">
                  Over the years, our dedication to innovation and customer satisfaction has fueled our growth and earned us a reputation
                   for excellence. From humble beginnings, we&#39;ve grown into a trusted name in the industry,
                    known for delivering furniture that exceeds expectations.
                  </p>
                  
                </div>
      </div>
    </div>
        </div>
      </div>

   <div className="container">
    <div className="max-w-xl mx-auto mb-8 md:mb-12 text-center ">
    <Image width={64} height={64} className="mx-auto " alt="" src="/like.svg" />
    <h3 className="font-medium leading-none mt-4 md:mt-6 text-2xl md:text-3xl">Why  Us</h3>
    <p className="mt-3">Choose us for exceptional quality,
         We prioritize your satisfaction by offering premium products and a seamless shopping experience. </p>
    </div>

    <div className="max-w-sm sm:max-w-[1720px] mx-auto grid sm:grid-cols-2 md:grid-cols-3 xl:flex lg:justify-between gap-7 flex-wrap lg:flex-nowrap aos-init aos-animate">
        <div className="p-6 pb-0 rounded-[10px] relative">
            <div className="w-[1px] h-[120px] absolute right-0 top-[30%] hidden 2xl:block border-l border-dashed border-b-[#BB976D]"></div>
            <Image width={48} height={48} alt="" className="size-12" src="/car.svg" />
            <h5 className="font-semibold text-xl md:text-2xl mt-3 md:mt-7">Free Shipping</h5>
            <p className="mt-2 sm:mt-3">Enjoy free shipping on all orders, making your shopping experience even more convenient. Get your favorite products delivered.</p>
        </div>

        <div className="p-6 pb-0 rounded-[10px] relative">
            <div className="w-[1px] h-[120px] absolute right-0 top-[30%] hidden 2xl:block border-l border-dashed border-b-[#BB976D]"></div>
            <Image width={48} height={48} alt="" className="size-12" src="/box.svg" />
            <h5 className="font-semibold text-xl md:text-2xl mt-3 md:mt-7">Easy to Return</h5>
            <p className="mt-2 sm:mt-3">Experience hassle-free returns with our easy-to-use return policy. If you are not satisfied, simply return your product for a quick.</p>
        </div>

        <div className="p-6 pb-0 rounded-[10px] relative">
            <div className="w-[1px] h-[120px] absolute right-0 top-[30%] hidden 2xl:block border-l border-dashed border-b-[#BB976D]"></div>
            <Image width={48} height={48} alt="" className="size-12" src="/card.svg" />
            <h5 className="font-semibold text-xl md:text-2xl mt-3 md:mt-7">Secure Payment</h5>
            <p className="mt-2 sm:mt-3">Shop with confidence using our secure payment options, ensuring your personal information stays protected. We prioritize your safety.</p>
        </div>

        
        <div className="p-6 pb-0 rounded-[10px] relative">
            <div className="w-[1px] h-[120px] absolute right-0 top-[30%] hidden 2xl:block border-l border-dashed border-b-[#BB976D]"></div>
            <Image width={48} height={48} alt="" className="size-12" src="/call.svg" />
            <h5 className="font-semibold text-xl md:text-2xl mt-3 md:mt-7">Customer Support</h5>
            <p className="mt-2 sm:mt-3">Our dedicated customer support team is here to assist you every step of the way. Reach out to us anytime for prompt, friendly help.</p>
        </div>

        <div className="p-6 pb-0 rounded-[10px] relative">
            <div className="w-[1px] h-[120px] absolute right-0 top-[30%] hidden 2xl:block border-l border-dashed border-b-[#BB976D]"></div>
            <Image width={48} height={48} alt="" className="size-12" src="/last.svg" />
            <h5 className="font-semibold text-xl md:text-2xl mt-3 md:mt-7">Product QC Team</h5>
            <p className="mt-2 sm:mt-3">Our meticulous product QC team ensures every item meets our highest standards. Trust in quality assurance that goes beyond expectation.</p>
        </div>

    </div>

    
   </div>
    </>
  );
}

export default AboutPage;
