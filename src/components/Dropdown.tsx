import { FaUser, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";
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

export default function DropdownMenuCheckboxes() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({
      callbackUrl: window.location.origin + "/login",
    });
  };
  const firstLetter = session?.user?.name?.charAt(0).toUpperCase() || "?";
  return (
    <div className="flex justify-center gap-2 items-center ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              className="relative cursor-pointer w-10 h-10 text-center rounded-full ml-2 overflow-hidden p-0 bg-gray-200 text-gray-800 hover:bg-gray-300"
              variant="ghost"
            >
              <span className="w-full h-full flex text-center items-center justify-center font-semibold text-lg">
                {firstLetter}
              </span>
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem>
            <Link
              href="/profile"
              className="w-full flex justify-center items-center gap-2"
            >
              <FaUser /> User Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/cart"
              className="w-full flex justify-center items-center gap-2"
            >
              <FaShoppingCart /> Cart
            </Link>
          </DropdownMenuItem>

          {session?.user?.role === "admin" && (
            <>
              <DropdownMenuItem>
                <Link
                  href="/new"
                  className="w-full flex justify-center items-center gap-2"
                >
                  add new
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem>
            <Button
              className="cursor-pointer justify-center mx-auto"
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
