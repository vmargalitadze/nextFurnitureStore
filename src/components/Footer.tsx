import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="py-24 px-4 md:px-8  lg:px-16 xl:32 2xl:px-64 bg-gray-100 text-sm mt-24">
     
     <div className="flex flex-col md:flex-row justify-center items-start gap-16 text-center md:text-left">

  <div className="w-full md:w-1/2 lg:w-1/3 items-center flex flex-col gap-6 mx-auto">
    <Link href="/">
    <Image className="rounded-full" src="/logo.png" alt="" width={70} height={70} />
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

  


</div>

      
  
    </div>
  );
};

export default Footer;
