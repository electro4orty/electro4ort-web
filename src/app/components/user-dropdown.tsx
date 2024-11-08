import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/auth-store';
import { ChevronUp, LogOut, Settings2, User2 } from 'lucide-react';

export default function UserDropdown() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.displayName}
              className="size-8 rounded-full object-cover object-center"
            />
          ) : (
            <User2 />
          )}
          <span>{user.displayName}</span>
          <ChevronUp className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
        <DropdownMenuItem>
          <User2 className="size-4 mr-2" />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings2 className="size-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="size-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
