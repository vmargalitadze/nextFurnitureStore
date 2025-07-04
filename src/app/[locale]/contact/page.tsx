import { Link } from "@/i18n/navigation";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function ContactPage() {
  const t = useTranslations("contact");

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-[400px] flex items-center justify-center bg-overlay p-14 sm:p-16 before:bg-title before:bg-opacity-70 overflow-hidden">
        <Image
          src="/bg.jpg"
          alt="Background"
          fill
          quality={80}
          className="object-cover z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
        <div className="relative z-20 text-center w-full max-w-4xl mx-auto px-4">
          <h1 className="text-primary text-xl md:text-[45px] font-normal leading-none text-center capitalize">
            {t('hero.title')}
          </h1>
         
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          
          {/* Contact Form Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            
            {/* Contact Image */}
            <div className="order-2 lg:order-1">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-2xl transform "></div>
                <Image
                  src="/contact.jpg"
                  alt="Contact Us"
                  width={600}
                  height={500}
                  className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="order-1 lg:order-2">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    {t('breadcrumb.sendMessage')}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {t('form.description')}
                    </p>
                  </div>

                  <form className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[18px] font-bold text-gray-700  tracking-wide">
                          {t('form.fullName')}
                        </label>
                        <input
                          className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 placeholder-gray-400"
                          placeholder={t('form.fullNamePlaceholder')}
                          type="text"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[18px] font-bold  text-gray-700  tracking-wide">
                          {t('form.email')}
                        </label>
                        <input
                          className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 placeholder-gray-400"
                          placeholder={t('form.emailPlaceholder')}
                          type="email"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[18px] font-bold text-gray-700  tracking-wide">
                          {t('form.phone')}
                        </label>
                        <input
                          className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 placeholder-gray-400"
                          placeholder={t('form.phonePlaceholder')}
                          type="tel"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[18px] font-bold  text-gray-700  tracking-wide">
                          {t('form.subject')}
                        </label>
                        <select className="w-full h-12 px-4 bg-white border-2 text-gray-400 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300">
                          <option  className="text-gray-400" value="">{t('info.selectSubject')}</option>
                          <option className="text-gray-400"  value="payment">{t('form.subjectOptions.payment')}</option>
                          <option className="text-gray-400"  value="furniture">{t('form.subjectOptions.furniture')}</option>
                          <option className="text-gray-400"  value="agreement">{t('form.subjectOptions.agreement')}</option>
                          <option className="text-gray-400"  value="carrying">{t('form.subjectOptions.carrying')}</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[18px] font-bold  text-gray-700  tracking-wide">
                        {t('form.message')}
                      </label>
                      <textarea
                        className="w-full h-32 px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 placeholder-gray-400 resize-none"
                        placeholder={t('form.messagePlaceholder')}
                        rows={5}
                      />
                    </div>

                    <Button className="w-[30%] mx-auto flex justify-center items-center px-4 mb-10 py-2 text-[20px] font-bold text-white bg-[#438c71] rounded-lg hover:bg-[#3a7a5f] transition-colors">
                      {t('form.submit')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

    
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Contact Information Cards */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{t('info.locations')}</h3>
                      <p className="text-gray-600 text-[16px]">{t('info.batumiAddress')}</p>
                      <p className="text-gray-600 text-[16px]">{t('info.tbilisiAddress')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{t('info.email')}</h3>
                      <a href="mailto:info@sleepandbed.ge" className="text-orange-600 hover:text-orange-700 text-[16px] transition-colors">
                        {t('info.emailAddress')}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{t('info.call')}</h3>
                      <a href="tel:+995123456789" className="text-orange-600 hover:text-orange-700 text-[16px] transition-colors">
                        {t('info.phoneNumber')}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map Section */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-[400px] md:h-[450px]">
                    <iframe
                      className="w-full h-full"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2933.203682968321!2d41.6285049!3d41.6399867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40678700245cd783%3A0xa1c772006499c03c!2sSleep%26Bed%20Georgia!5e0!3m2!1sen!2s!4v1712549012345"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactPage;