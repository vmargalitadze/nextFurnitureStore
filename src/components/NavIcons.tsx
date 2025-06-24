"use client";
import React, { useState } from "react";

import { Link } from "@/i18n/navigation";

import LocaleSwitcher from "./switcher";
import DropdownMenuCheckboxes from "./Dropdown";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
function NavIcons() {
  const t = useTranslations("navitems");

  const { data: session } = useSession();

  return (
    <>
    
    
    <div className="flex items-start pr-12 gap-4 xl:gap-6 relative">
      <>
      {!session && (
        <Link href="/sign-in" className="text-[18px]">
      {t('login')}
        </Link>
      )}
      <LocaleSwitcher />
        {session && (
          <>
        
        
            <DropdownMenuCheckboxes />

           

          </>
        )}
      </>
    </div>
    </>
  );
}

export default NavIcons;
