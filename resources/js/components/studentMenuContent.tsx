import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/components/user-info";
import { useMobileNavigation } from "@/hooks/use-mobile-navigation";
import { logout } from "@/routes";
import { edit } from "@/routes/profile";
import { type User } from "@/types";
import { Link, router } from "@inertiajs/react";
import { LogOut, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useDisclosure } from "@/hooks/useDisclosure";
import ChangePasswordDialog from "./admin/passwordChangeDialog";

interface StudentMenuContentProps {
  user: User;
}

export function StudentMenuContent({ user }: StudentMenuContentProps) {
  const cleanup = useMobileNavigation();
  const passwordChangeDisclosure = useDisclosure();
  const handleLogout = () => {
    cleanup();
    router.flushAll();
  };
  const handleChangePassword = () => {
    // cleanup();
    passwordChangeDisclosure.onOpen();
  };
  return (
    <>
      <ChangePasswordDialog
        open={passwordChangeDisclosure.isOpen}
        onClose={passwordChangeDisclosure.onClose}
        data={passwordChangeDisclosure.data}
      />
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleChangePassword();
          }}
        >
          <div className="flex w-full items-center">
            <Settings className="mr-2" />
            Change Password
          </div>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          handleLogout();
          router.post(logout.url());
        }}
        data-test="logout-button"
      >
        <LogOut className="mr-2" />
        Log out
      </DropdownMenuItem>
    </>
  );
}
