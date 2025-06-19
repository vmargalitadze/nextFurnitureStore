"use client";
import React, { useState } from "react";

import { Link } from "@/i18n/navigation";

import LocaleSwitcher from "./switcher";
import DropdownMenuCheckboxes from "./Dropdown";
import { useSession } from "next-auth/react";
function NavIcons() {


  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <>
      {!session && (
        <Link href="/sign-in" className="text-sm">
          Login
        </Link>
      )}
        {session && (
          <>
        

            <DropdownMenuCheckboxes />

           

            <LocaleSwitcher />
          </>
        )}
      </>
    </div>
  );
}

export default NavIcons;
