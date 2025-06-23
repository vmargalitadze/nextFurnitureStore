import { FaUser, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";

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
  const firstLetter = session?.user?.name;
  return (
    <div className="flex justify-center  gap-2 items-center ">
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <div className="flex items-center">
  <button
    className="inline-flex items-center gap-2 h-[40px] px-4 rounded-full bg-white/70 backdrop-blur-md shadow-lg text-black font-semibold transition-all hover:bg-white truncate max-w-[160px]"
  >
    <span className="text-base font-medium truncate">{firstLetter}</span>
  </button>
</div>
</DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-[200px] "
          align="center"
          side="bottom"
          sideOffset={8}
          forceMount
        >
          <DropdownMenuItem>
            <Link
              href="/profile"
              className="w-full text-xl flex justify-start items-center gap-2"
            >
              <FaUser /> User Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/cart"
              className="w-full flex text-xl justify-start items-center gap-2"
            >
              <FaShoppingCart /> Cart
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Button
              className="cursor-pointer text-xl  justify-start mx-auto"
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
