"use client";
import React, { useState } from 'react'
import Image from 'next/image';

import CartModel from './CartModel';
function NavIcons() {

  const [isCartOpen, setIsCartOpen] = useState(false);







  return (
    <div className='flex items-center gap-4 xl:gap-6 relative'>
        <Image
        src="/profile.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
    
        
      />
    
             <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <Image src="/cart.png" alt="" width={22} height={22} />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-[#BB976D] rounded-full text-white text-sm flex items-center justify-center">
          2
        </div>
      </div>
      {isCartOpen && <CartModel />}
    </div>
  )
}

export default NavIcons