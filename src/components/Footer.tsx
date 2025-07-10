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
               kipianistore@gmail.com
              </a>
              <a 
                href="tel:+995557394374" 
                className="text-white transition-colors duration-300 text-xl"
              >
                +995557394374,
              </a>
              <p className="text-white text-xl">
              {t('batumi')}
              </p>
              <p className="text-white text-xl">
              {t('kobuleti')}
              </p>
              <p className="text-white text-xl">
              {t('kutaisi')}
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
                className="w-12 h-12 bg-gray-300  rounded-full flex items-center justify-center transition-all duration-300"
              >
                <FaFacebook className="w-7 h-7" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-300  rounded-full flex items-center justify-center transition-all duration-300"
              >
                <FaInstagram className="w-7 h-7" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-300  rounded-full flex items-center justify-center transition-all duration-300"
              >
                <FaTiktok className="w-7 h-7" />
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
