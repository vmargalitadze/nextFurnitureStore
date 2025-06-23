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
    <Button
      className="bg-gray-200 text text-gray-800 hover:bg-gray-300 px-4 py-2 h-auto w-auto rounded-md  truncate max-w-[160px]"
      variant="ghost"
    >
      <span className="text-[20px]   max-w-[160px]">

      {firstLetter}

      </span>
    </Button>
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
