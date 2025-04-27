import Image from 'next/image'
import React from 'react'

function CartModel() {
    const carItems = true
  return (
   <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
   {!carItems ? (
    <div className=''>Cart is Empty</div>
   ) : (
    <>
     <h2 className="text-xl">Shopping Cart</h2>
    
    <div className='flex flex-col gap-8'>
        <Image src="" alt='product image' width={72} height={96} className="object-cover rounded-md" />

        <div className="flex flex-col justify-between w-full">
            {/* top */}
            <div className="">
                    {/* TITLE */}
                    <div className="flex items-center justify-between gap-8">
                      <h3 className="font-semibold">
                 erti
                      </h3>
                      <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
                    1
                      </div>
                    </div>
                    {/* DESC */}
                  
                  </div>

  {/* bottom */}
        </div>
    </div>
    </>
   )}
   </div>
  )
}

export default CartModel