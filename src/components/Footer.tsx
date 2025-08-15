import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FaFacebook, FaInstagram, FaTiktok, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("footer");

  return (
    <footer className="bg-[#1A2A3A] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">

          {/* Header Section */}
          <div className="mb-12">

            <a
              href="mailto:kipianistore@gmail.com"
              className="text-gray-300 hover:text-white transition-colors duration-300 text-lg block"
            >
              kipianistore@gmail.com
            </a>
          </div>

          {/* Contact Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 w-full">

            {/* Batumi */}
            <div>
              <div className="flex flex-col items-center justify-center mb-4">
                <h3 className="text-xl flex flex-row font-semibold">    <FaMapMarkerAlt className="w-6 h-6 text-[#ce7c2a] mr-3" /> {t("batumi")}</h3>
                <p className="text-gray-300">{t("batumiAddress")}</p>
                <p className="text-gray-300">{t("batumiAddress2")}</p>
              </div>
              <div className="space-y-2">
                <a href="tel:+995557394374" className="block text-lg text-gray-300 hover:text-white transition">
                  +995 557 394 374
                </a>
                <a href="tel:+995568613022" className="block text-lg text-gray-300 hover:text-white transition">
                  +995 568 613 022
                </a>
              </div>
            </div>

            {/* Kobuleti */}
            <div>
              <div className="flex flex-col items-center justify-center mb-4">
                <h3 className="text-xl flex flex-row font-semibold">    <FaMapMarkerAlt className="w-6 h-6 text-[#ce7c2a] mr-3" /> {t("kobuleti")}</h3>
                <p className="text-gray-300">{t("kobuletiAddress")}</p>
              </div>
              <div className="space-y-2">
                <a href="tel:+995555244403" className="block text-lg text-gray-300 hover:text-white transition">
                  +995 555 244 403
                </a>
                <a href="tel:+995597808047" className="block text-lg text-gray-300 hover:text-white transition">
                  +995 597 808 047
                </a>
              </div>
            </div>

            {/* Kutaisi */}
            <div>
              <div className="flex flex-col items-center justify-center mb-4">
                <h3 className="text-xl flex flex-row font-semibold">    <FaMapMarkerAlt className="w-6 h-6 text-[#ce7c2a] mr-3" /> {t("kutaisi")}</h3>
                <p className="text-gray-300">{t("kutaisiAddress")}</p>
              </div>
              <div className="space-y-2">
                <a href="tel:+99551407989" className="block text-lg text-gray-300 hover:text-white transition">
                  +995 514 079 89
                </a>
              </div>
            </div>

            <div>
              <div className="flex flex-col items-center justify-center mb-4">

                <h3 className="text-xl flex flex-row font-semibold">    <FaMapMarkerAlt className="w-6 h-6 text-[#ce7c2a] mr-3" /> {t("tbilisi")}</h3>
                <p className="text-gray-300">{t("tbilisiAddress")}</p>
              </div>
              <div className="space-y-2">
                <a href="tel:+995557226880" className="block text-lg text-gray-300 hover:text-white transition">
                  +995557226880
                </a>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="text-center border-t border-gray-600 pt-8 w-full">

            <div className="flex justify-center space-x-6">
              <a href="#" className="w-14 h-14 bg-gray-700 hover:bg-[#ce7c2a] rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110" aria-label="Facebook">
                <FaFacebook className="w-7 h-7" />
              </a>
              <a href="#" className="w-14 h-14 bg-gray-700 hover:bg-[#ce7c2a] rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110" aria-label="Instagram">
                <FaInstagram className="w-7 h-7" />
              </a>
              <a href="#" className="w-14 h-14 bg-gray-700 hover:bg-[#ce7c2a] rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110" aria-label="TikTok">
                <FaTiktok className="w-7 h-7" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>

  );
};

export default Footer;
