import Link from 'next/link'
import React from 'react'
import Menu from './Menu'
import Image from 'next/image'
import SearchBar from './SearchBar'
import NavIcons from './NavIcons'
function Navbar() {
  return (
    <div className='fixed top-0 left-0 w-full z-50 h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-white shadow-sm'>

      <div className="h-full flex items-center justify-between md:hidden">

      <Link className="text-2xl tracking-wide" href='/' >Store</Link>
      <Menu />
      </div>


<div className="hidden md:flex items-center justify-between  gap-8 h-full">

    <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
    <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={24} height={24} />
            <div className="text-2xl tracking-wide">Store</div>
          </Link>
          <div className="hidden xl:flex gap-4">
            
            <Link href="/all">Products</Link>
          
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
    </div>

    <div className="w-2/3 flex items-center justify-between  gap-8 ">
    <SearchBar />
    <NavIcons />
    </div>

</div>
      
    </div>
  )
}

export default Navbar