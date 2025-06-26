import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("footer");

  return (
    <footer className="bg-[#41313e] text-black">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-[35rem] mx-auto">

        <div className="flex flex-col md:flex-row items-center md:items-start justify-center  md:justify-between space-y-6 md:space-y-0">
          
        

    

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-xl text-white font-semibold">{t('contact')}</h3>
            <div className="flex flex-col space-y-2 text-center md:text-left">
              <a 
                href="mailto:hello@lama.dev" 
                className="text-white transition-colors duration-300 text-xl"
              >
                hello@lama.dev
              </a>
              <a 
                href="tel:+1234567890" 
                className="text-white transition-colors duration-300 text-xl"
              >
                +1 (234) 567-890
              </a>
              <p className="text-white text-xl">
                3252 Winding Way, CA 90210
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center md:items-start space-y-4">
     
            <div className="flex space-x-4">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-300  rounded-full flex items-center justify-center transition-all duration-300"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-300  rounded-full flex items-center justify-center transition-all duration-300"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-300  rounded-full flex items-center justify-center transition-all duration-300"
              >
                <FaTiktok className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>

   
  
    </footer>
  );
};

export default Footer;
