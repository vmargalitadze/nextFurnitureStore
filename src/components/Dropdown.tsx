import { FaUser, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

// Global dropdown state manager (same as in switcher.tsx)
let activeDropdown: string | null = null;
const dropdownListeners: Set<(id: string | null) => void> = new Set();

const closeAllDropdowns = (exceptId?: string) => {
  if (activeDropdown && activeDropdown !== exceptId) {
    activeDropdown = null;
    dropdownListeners.forEach(listener => listener(null));
  }
};

const setActiveDropdown = (id: string | null) => {
  activeDropdown = id;
  dropdownListeners.forEach(listener => listener(id));
};

export default function DropdownMenuCheckboxes() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownId = 'user-dropdown';

  // Listen for other dropdowns opening
  useEffect(() => {
    const handleDropdownChange = (id: string | null) => {
      if (id !== dropdownId && open) {
        setOpen(false);
      }
    };

    dropdownListeners.add(handleDropdownChange);
    return () => {
      dropdownListeners.delete(handleDropdownChange);
    };
  }, [open, dropdownId]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // Force close all other dropdowns immediately
      closeAllDropdowns(dropdownId);
      setActiveDropdown(dropdownId);
      // Also trigger a global event for custom dropdowns
      window.dispatchEvent(new CustomEvent('closeAllDropdowns', { detail: { exceptId: dropdownId } }));
    } else {
      setActiveDropdown(null);
    }
  };

  const handleSignOut = () => {
    signOut({
      callbackUrl: window.location.origin + "/login",
    });
  };
  
  const firstLetter = session?.user?.name;
  
  return (
    <div className="flex  justify-center gap-2 items-center">
      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <button className="inline-flex items-center gap-2 h-[40px] px-4 rounded-full bg-white/70 backdrop-blur-md border border-gray-200 text-black font-semibold transition-all hover:bg-white truncate max-w-[160px]">
              <span className="text-base font-medium truncate">{firstLetter}</span>
            </button>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-[200px] z-[900]"
          align="center"
          side="bottom"
          sideOffset={8}
          forceMount
        >
          <DropdownMenuItem>
            <Link
              href="/profile"
              className="w-full text-base font-medium flex justify-start items-center gap-2"
            >
              <FaUser /> User Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/cart"
              className="w-full flex text-base font-medium justify-start items-center gap-2"
            >
              <FaShoppingCart /> Cart
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Button
              className="cursor-pointer text-xl justify-start mx-auto"
              onClick={handleSignOut}
            >
              <FaSignOutAlt /> Sign Out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
