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
import UserInfo from '@/components/user-info';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getFileUrl } from '@/utils/get-file-url';
import Settings from './settings';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';

export default function UserDropdown() {
  const { user, logout } = useAuthStore();
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton size="lg">
            {user.avatar ? (
              <Avatar className="size-8">
                <AvatarImage
                  src={user.avatar ? getFileUrl(user.avatar) : undefined}
                  alt={user.displayName}
                />
                <AvatarFallback>
                  {user.displayName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <User2 />
            )}
            <span>{user.displayName}</span>
            <ChevronUp className="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
          <DropdownMenuItem onClick={() => setIsUserDialogOpen(true)}>
            <User2 className="size-4 mr-2" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsSettingsDialogOpen(true)}>
            <Settings2 className="size-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="size-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResponsiveDialog
        open={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Profile</ResponsiveDialogTitle>
            <ResponsiveDialogDescription className="sr-only">
              Profile
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <UserInfo userId={user.id} />
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={isSettingsDialogOpen}
        onOpenChange={setIsSettingsDialogOpen}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Settings</ResponsiveDialogTitle>
            <ResponsiveDialogDescription className="sr-only">
              Settings
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <Settings />
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  );
}
