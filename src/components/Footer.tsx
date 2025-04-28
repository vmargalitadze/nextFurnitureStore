import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="py-24 px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 bg-gray-100 text-sm mt-24">
     
      <div className="flex flex-col md:flex-row text-center justify-between gap-24">
      
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
          <Link href="/">
            <div className="text-2xl tracking-wide">LAMA</div>
          </Link>
          <p>
            3252 Winding Way, Central Plaza, Willowbrook, CA 90210, United
            States
          </p>
          <span className="font-semibold">hello@lama.dev</span>
          <span className="font-semibold">+1 234 567 890</span>
          <div className="flex mx-auto gap-6">
            <a href="" target="_blank" className="text-black text-2xl ">
              <FaFacebook className="w-8 h-8 " />
            </a>
            <a href="" target="_blank" className="text-black text-2xl ">
              <FaInstagram className="w-8 h-8" />
            </a>

            <a href="" target="_blank" className="text-black text-2xl ">
              <FaTiktok className="w-8 h-8" />
            </a>
          </div>
        </div>
    
        <div className="hidden lg:flex justify-between w-1/2">
          
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">SHOP</h1>
            <div className="flex flex-col gap-6">
              <Link href="">New Arrivals</Link>
              <Link href="">Accessories</Link>
              <Link href="">Men</Link>
              <Link href="">Women</Link>
              <Link href="">All Products</Link>
            </div>
          </div>

          <div className="flex flex-col justify-start ">
            <h1 className="font-medium text-lg">COMPANY</h1>
            <div className="flex flex-col gap-6 lg:mt-8">
              <Link href="">About Us</Link>
              <Link href="">Contacts</Link>
            </div>
          </div>
        </div>
   
      </div>
      
  
    </div>
  );
};

export default Footer;
