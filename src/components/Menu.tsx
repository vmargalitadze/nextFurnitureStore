"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Menu = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Image
        src="/menu.png"
        alt=""
        width={28}
        height={28}
        className="cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="absolute bg-white text-black left-0 w-full h-screen flex flex-col items-center justify-start gap-8 text-xl z-10">
          <div className="mt-[100px] flex flex-col items-center gap-8">
            <Link href="/all" onClick={handleClose}>Products</Link>
            <Link href="/about" onClick={handleClose}>About</Link>
            <Link href="/contact" onClick={handleClose}>Contact</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
