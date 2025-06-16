import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="py-24 px-4 md:px-8  lg:px-16 xl:32 2xl:px-64 bg-gray-100 text-sm mt-24">
     
     <div className="flex flex-col md:flex-row justify-center items-start gap-16 text-center md:text-left">

  <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col gap-6 mx-auto">
    <Link href="/">
      <div className="text-2xl tracking-wide">Store</div>
    </Link>
    <p>
      3252 Winding Way, Central Plaza, Willowbrook, CA 90210, United States
    </p>
    <span className="font-semibold">hello@lama.dev</span>
    <span className="font-semibold">+1 234 567 890</span>
    <div className="flex justify-center md:justify-start gap-6">
      <a href="#" target="_blank" className="text-black text-2xl">
        <FaFacebook className="w-6 h-6" />
      </a>
      <a href="#" target="_blank" className="text-black text-2xl">
        <FaInstagram className="w-6 h-6" />
      </a>
      <a href="#" target="_blank" className="text-black text-2xl">
        <FaTiktok className="w-6 h-6" />
      </a>
    </div>
  </div>

  
  <div className="hidden md:flex w-full md:w-1/2 lg:w-1/3 flex-col gap-6 mx-auto">
  <h1 className="font-medium text-lg">COMPANY</h1>
  <div className="flex flex-col gap-4 mt-4">
    <Link href="/all">Products</Link>
    <Link href="/about">About Us</Link>
    <Link href="/contact">Contact</Link>
  </div>
</div>

</div>

      
  
    </div>
  );
};

export default Footer;
