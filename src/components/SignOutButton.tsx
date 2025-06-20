"use client";

import { Button } from "@/components/ui/button";
import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

const SignOutButton = () => {
  const t = useTranslations("profile");

  const handleSignOut = () => {
    signOut({
      callbackUrl: window.location.origin + "/sign-in",
    });
  };

  return (
    <Button 
      className="cursor-pointer justify-center mx-auto w-full"
      onClick={handleSignOut}
      variant="outline"
    >
      <FaSignOutAlt className="mr-2" /> 
      {t('signOut')}
    </Button>
  );
};

export default SignOutButton; 