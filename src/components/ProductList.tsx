import Link from "next/link";
import React from "react";
import Image from "next/image";

function ProductList() {
  return (
    <>
      <div className="s-py-100-50">
        <div className="container mx-auto">
          <div className="flex justify-center items-center mb-[40px] md:mb-12 ">
            <div>
              <span className="text-primary font-secondary font-normal text-6xl sm:text-7xl block -ml-5 -mb-3 sm:-mb-[30px] leading-normal sm:leading-normal">
                ახალი
              </span>
              <h6 className="font-normal leading-none tracking-[.5em] lg:mt-2 sm:tracking-[1em] uppercase">
                პროდუქტები
              </h6>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8 ">
            <div className="relative overflow-hidden group">
              <Link href={"#"}>
                <Image width={100} height={100}
                  className="w-full transform duration-300 group-hover:scale-110"
                  alt="product-card"
                  src="/chair.jpg"
                />
              </Link>

              <div className="flex flex-col items-start gap-3 md:gap-4 absolute z-20 w-11/12 bottom-3 xl:bottom-5 left-1/2 transform -translate-x-1/2 p-4 xl:p-5 bg-white dark:bg-title bg-opacity-[85%] dark:bg-opacity-[85%] group-hover:-translate-y-1/2 duration-500 group-hover:opacity-0 group-hover:invisible">
                <h4 className="font-medium leading-none dark:text-white text-lg">
                  $122.75
                </h4>
                <h5 className="font-normal dark:text-white text-paragraph leading-[1.5]">
                  <Link href="/product-details" data-discover="true">
                    Luxury Lamp for Wall
                  </Link>
                </h5>
              </div>

              <div className="absolute z-10 flex gap-2 justify-center bottom-5 md:bottom-7 w-full transform translate-y-5 opacity-0 duration-500 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible">
                <button className="icon-button relative w-9 lg:w-12 h-9 p-2 lg:h-12 bg-white dark:bg-title bg-opacity-80 flex items-center justify-center rounded-full">
                  <Image src="/cart.png" alt="" width={22} height={22} />
                  <span className="tooltip">
                    დაამატე კალათაში
                    <span className="tooltip-arrow"></span>
                  </span>
                </button>
                <Link
                  href="/#"
                  className="icon-button relative w-9 lg:w-12 h-9 p-2 lg:h-12 bg-white dark:bg-title bg-opacity-80 flex items-center justify-center rounded-full"
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="dark:text-white h-[22px] w-[20px]"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span className="tooltip">
                    დეტალები
                    <span className="tooltip-arrow"></span>
                  </span>
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden group">
              <Link href={"#"}>
                <Image width={100} height={100}
                  className="w-full transform duration-300 group-hover:scale-110"
                  alt="product-card"
                  src="/chair.jpg"
                />
              </Link>

              <div className="flex flex-col items-start gap-3 md:gap-4 absolute z-20 w-11/12 bottom-3 xl:bottom-5 left-1/2 transform -translate-x-1/2 p-4 xl:p-5 bg-white dark:bg-title bg-opacity-[85%] dark:bg-opacity-[85%] group-hover:-translate-y-1/2 duration-500 group-hover:opacity-0 group-hover:invisible">
                <h4 className="font-medium leading-none dark:text-white text-lg">
                  $122.75
                </h4>
                <h5 className="font-normal dark:text-white text-paragraph leading-[1.5]">
                  <Link href="/product-details" data-discover="true">
                    Luxury Lamp for Wall
                  </Link>
                </h5>
              </div>

              <div className="absolute z-10 flex gap-2 justify-center bottom-5 md:bottom-7 w-full transform translate-y-5 opacity-0 duration-500 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible">
                <button className="icon-button relative w-9 lg:w-12 h-9 p-2 lg:h-12 bg-white dark:bg-title bg-opacity-80 flex items-center justify-center rounded-full">
                  <Image src="/cart.png" alt="" width={22} height={22} />
                  <span className="tooltip">
                    დაამატე კალათაში
                    <span className="tooltip-arrow"></span>
                  </span>
                </button>
                <Link
                  href="/#"
                  className="icon-button relative w-9 lg:w-12 h-9 p-2 lg:h-12 bg-white dark:bg-title bg-opacity-80 flex items-center justify-center rounded-full"
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="dark:text-white h-[22px] w-[20px]"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span className="tooltip">
                    დეტალები
                    <span className="tooltip-arrow"></span>
                  </span>
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden group">
              <Link href={"#"}>
                <Image width={100} height={100}
                  className="w-full transform duration-300 group-hover:scale-110"
                  alt="product-card"
                  src="/chair.jpg"
                />
              </Link>

              <div className="flex flex-col items-start gap-3 md:gap-4 absolute z-20 w-11/12 bottom-3 xl:bottom-5 left-1/2 transform -translate-x-1/2 p-4 xl:p-5 bg-white dark:bg-title bg-opacity-[85%] dark:bg-opacity-[85%] group-hover:-translate-y-1/2 duration-500 group-hover:opacity-0 group-hover:invisible">
                <h4 className="font-medium leading-none dark:text-white text-lg">
                  $122.75
                </h4>
                <h5 className="font-normal dark:text-white text-paragraph leading-[1.5]">
                  <Link href="/product-details" data-discover="true">
                    Luxury Lamp for Wall
                  </Link>
                </h5>
              </div>

              <div className="absolute z-10 flex gap-2 justify-center bottom-5 md:bottom-7 w-full transform translate-y-5 opacity-0 duration-500 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible">
                <button className="icon-button relative w-9 lg:w-12 h-9 p-2 lg:h-12 bg-white dark:bg-title bg-opacity-80 flex items-center justify-center rounded-full">
                  <Image src="/cart.png" alt="" width={22} height={22} />
                  <span className="tooltip">
                    დაამატე კალათაში
                    <span className="tooltip-arrow"></span>
                  </span>
                </button>
                <Link
                  href="/#"
                  className="icon-button relative w-9 lg:w-12 h-9 p-2 lg:h-12 bg-white dark:bg-title bg-opacity-80 flex items-center justify-center rounded-full"
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="dark:text-white h-[22px] w-[20px]"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span className="tooltip">
                    დეტალები
                    <span className="tooltip-arrow"></span>
                  </span>
                </Link>
              </div>
            </div>


            <div className="relative overflow-hidden group">
              <Link href={"#"}>
                <Image width={100} height={100}
                  className="w-full transform duration-300 group-hover:scale-110"
                  alt="product-card"
                  src="/chair.jpg"
                />
              </Link>

              <div className="flex flex-col items-start gap-3 md:gap-4 absolute z-20 w-11/12 bottom-3 xl:bottom-5 left-1/2 transform -translate-x-1/2 p-4 xl:p-5 bg-white dark:bg-title bg-opacity-[85%] dark:bg-opacity-[85%] group-hover:-translate-y-1/2 duration-500 group-hover:opacity-0 group-hover:invisible">
                <h4 className="font-medium leading-none dark:text-white text-lg">
                  $122.75
                </h4>
                <h5 className="font-normal dark:text-white text-paragraph leading-[1.5]">
                  <Link href="/product-details" data-discover="true">
                    Luxury Lamp for Wall
                  </Link>
                </h5>
              </div>

              <div className="absolute z-10 flex gap-2 justify-center bottom-5 md:bottom-7 w-full transform translate-y-5 opacity-0 duration-500 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible">
                <button className="icon-button relative w-9 lg:w-12 h-9 p-2 lg:h-12 bg-white dark:bg-title bg-opacity-80 flex items-center justify-center rounded-full">
                  <Image src="/cart.png" alt="" width={22} height={22} />
                  <span className="tooltip">
                    დაამატე კალათაში
                    <span className="tooltip-arrow"></span>
                  </span>
                </button>
                <Link
                  href="/#"
                  className="icon-button relative w-9 lg:w-12 h-9 p-2 lg:h-12 bg-white dark:bg-title bg-opacity-80 flex items-center justify-center rounded-full"
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="dark:text-white h-[22px] w-[20px]"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span className="tooltip">
                    დეტალები
                    <span className="tooltip-arrow"></span>
                  </span>
                </Link>
              </div>
            </div>

        
          </div>

          <div className="text-center mt-7 md:mt-12">
            <Link className="btn-all btn-outline"  href="/shop-v1" data-discover="true"><span>ნახე ყველა პროდუქტი</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductList;
