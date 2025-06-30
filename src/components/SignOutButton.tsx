"use client";

import { Button } from "@/components/ui/button";
import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/context/CartContext";

const SignOutButton = () => {
  const t = useTranslations("profile");
  const { clearCart } = useCart();

  const handleSignOut = async () => {
    try {
      // Clear cart on server side
      await fetch('/api/cart/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
    
    // Clear cart on client side
    clearCart();
    
    // Sign out
    signOut({
      callbackUrl: window.location.origin + "/sign-in",
    });
  };

  return (
    <Button 
    className="w-[70%] flex justify-center mx-auto items-center mb-14 px-4 py-2 text-[20px] font-bold text-[#438c71] bg-white border-2 border-[#438c71] rounded-lg hover:bg-[#438c71] hover:text-white transition-colors flex items-center justify-center gap-2"
      onClick={handleSignOut}
   
    >
      <FaSignOutAlt className="mr-2" /> 
      {t('signOut')}
    </Button>
  );
};

export default SignOutButton; 