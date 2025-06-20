import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("footer");

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          
          {/* Logo and Company Info */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <Link href="/" className="group">
              <Image 
                className="rounded-full transition-transform duration-300 group-hover:scale-110" 
                src="/logo.png" 
                alt="Company Logo" 
                width={60} 
                height={60} 
              />
            </Link>
            <p className="text-gray-300 text-sm text-center md:text-left max-w-xs">
              {t('companyDescription')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-lg font-semibold">{t('quickLinks')}</h3>
            <div className="flex flex-col space-y-2 text-center md:text-left">
              <Link 
                href="/products" 
                className="text-gray-300 hover:text-[#bba588] transition-colors duration-300 text-sm"
              >
                {t('allProducts')}
              </Link>
              <Link 
                href="/about" 
                className="text-gray-300 hover:text-[#bba588] transition-colors duration-300 text-sm"
              >
                {t('aboutUs')}
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-300 hover:text-[#bba588] transition-colors duration-300 text-sm"
              >
                {t('contact')}
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-lg font-semibold">{t('contact')}</h3>
            <div className="flex flex-col space-y-2 text-center md:text-left">
              <a 
                href="mailto:hello@lama.dev" 
                className="text-gray-300 hover:text-[#bba588] transition-colors duration-300 text-sm"
              >
                hello@lama.dev
              </a>
              <a 
                href="tel:+1234567890" 
                className="text-gray-300 hover:text-[#bba588] transition-colors duration-300 text-sm"
              >
                +1 (234) 567-890
              </a>
              <p className="text-gray-300 text-sm">
                3252 Winding Way, CA 90210
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-lg font-semibold">{t('followUs')}</h3>
            <div className="flex space-x-4">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-700 hover:text-[#bba588] rounded-full flex items-center justify-center transition-all duration-300"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-700 hover:text-[#bba588] rounded-full flex items-center justify-center transition-all duration-300"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-700 hover:text-[#bba588] rounded-full flex items-center justify-center transition-all duration-300"
              >
                <FaTiktok className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

   
  
    </footer>
  );
};

export default Footer;
