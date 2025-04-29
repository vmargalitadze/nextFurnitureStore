import Link from "next/link";
import React from "react";
import Image from "next/image";
function ContactPage() {
  return (
    <>
      <div className="relative min-h-[400px] flex items-center justify-center bg-overlay p-14 sm:p-16 before:bg-title before:bg-opacity-70 overflow-hidden">
        <Image
          src="/bg.jpg"
          alt="Background"
          fill
          quality={80}
          className="object-cover z-0"
        />

        <div className="absolute inset-0 bg-black/60 z-10" />

        <div className="relative z-20 text-center w-full">
          <h2 className="text-white  text-2xl md:text-[40px] font-normal leading-none text-center">
            Contact
          </h2>
          <ul className="flex items-center justify-center gap-[10px] text-base md:text-lg leading-none font-normal text-white mt-3 md:mt-4">
            <li>
              <Link href="/" data-discover="true">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary capitalize">Contact</li>
          </ul>
        </div>
      </div>
      <div className="pt-[70px] pb-[70px]">
  <div className="container mx-auto max-w-[1720px] px-4">
    
 
    <div className="flex justify-between gap-8 flex-wrap">

      <div className="max-w-[700px] w-full block">
        <Image
          src="/contact.jpg"
          alt="contact"
          width={700}
          height={500}
          className="w-full rounded-md h-auto"
        />
      </div>


      <div className="max-w-[725px] w-full">
        <h3 className="leading-none font-medium mt-3 md:mt-6 text-[22px]">
          დაგვიკავშირდით
        </h3>
        <p className="max-w-[474px] mt-3 md:mt-4 font-medium">
          We are here to address your inquiries, feedback, and partnership
          opportunities promptly and effectively.
        </p>

       
        <div className="mt-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className="text-base md:text-lg text-title text-black leading-none mb-2.5 block">
                Full Name
              </label>
              <input
                className="w-full h-12 md:h-14 bg-snow bg-dark-secondary border border-[#E3E5E6] text-title text-black focus:border-primary p-4 outline-none duration-300"
                placeholder="Enter your full name"
                type="text"
              />
            </div>
            <div>
              <label className="text-base md:text-lg text-title text-black leading-none mb-2.5 block">
                Email
              </label>
              <input
                className="w-full h-12 md:h-14 bg-snow bg-dark-secondary border border-[#E3E5E6] text-title text-black focus:border-primary p-4 outline-none duration-300"
                placeholder="Enter your email address"
                type="email"
              />
            </div>
            <div>
              <label className="text-base md:text-lg text-title text-black leading-none mb-2.5 block">
                Phone No.
              </label>
              <input
                className="w-full h-12 md:h-14 bg-snow  border border-[#E3E5E6] text-title text-black focus:border-primary p-4 outline-none duration-300"
                placeholder="Type your phone number"
                type="number"
              />
            </div>
            <div>
              <label className="text-base md:text-lg text-title text-black leading-none mb-2.5 block">
                Subject
              </label>
              <select className="w-full h-12 md:h-14 bg-snow bg-dark-secondary border border-[#E3E5E6] text-slate-400  focus:border-primary p-4 outline-none duration-300">
                <option value="1">Payment Problem</option>
                <option value="2">Furniture Problem</option>
                <option value="3">Agreement Problem</option>
                <option value="4">Carrying Problem</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="text-base md:text-lg text-title text-black leading-none mb-2.5 block">
            Your Message
          </label>
          <textarea
            className="w-full h-28 md:h-[170px] bg-snow border border-[#E3E5E6] text-title text-black focus:border-primary p-4 outline-none duration-300"
            name="Message"
            placeholder="Type your message"
          />
        </div>

    
        <div className="mt-5">
          <button  className="btn-all rounded-md text-black btn-outline">
            <span>გამოაგზავნე</span>
          </button>
        </div>
      </div>
    </div>


    <div className="lg:relative w-full mt-12 lg:mb-0 mb-20 h-[500px] md:h-[600px]">
  {/* Google Map */}
  <iframe
    className="lg:absolute top-0 left-0 w-full h-full"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2933.203682968321!2d41.6285049!3d41.6399867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40678700245cd783%3A0xa1c772006499c03c!2sSleep%26Bed%20Georgia!5e0!3m2!1sen!2s!4v1712549012345"
    loading="lazy"
    allowFullScreen
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>

  {/* Contact Info Overlay */}
  <div className="relative z-10 bg-white/90 backdrop-blur-md max-w-md w-full p-6 rounded-lg shadow-md lg:absolute lg:top-10 lg:right-10">
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-bold text-gray-800">ADDRESS</h2>
        <p className="text-gray-600">Batumi: A. Pushkin St. 44</p>
        <p className="text-gray-600">Tbilisi: T. Eristavi St. 1</p>

  
      </div>
      <div>
        <h2 className="font-bold text-gray-800">EMAIL</h2>
        <a href="mailto:your@email.com" className="text-teal-600">
        Sleepandbedgeorgia@gmail.com
        </a>
      </div>
      <div>
        <h2 className="font-bold text-gray-800">PHONE</h2>
        <a href="tel:123-456-7890" className="text-gray-600">
          123-456-7890
        </a>
      </div>
    </div>
  </div>
</div>


  </div>
</div>


      
    </>
  );
}

export default ContactPage;
