import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { getHubParticipantsService } from '@/features/hubs/services/get-hub-participants.service';
import { useQuery } from '@tanstack/react-query';
import { getInviteHubPath } from '../../constants/router-paths';
import { Button } from '@/components/ui/button';
import { Check, Link2, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useState } from 'react';
import UserStatusIndicator from '@/components/user-status-indicator';
import { getFileUrl } from '@/utils/get-file-url';
import { AppSidebarDropdownTrigger } from './app-sidebar-dropdown-trigger';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import UserInfo from '@/components/user-info';

interface ParticipantsProps {
  hubSlug: string;
}

export default function Participants({ hubSlug }: ParticipantsProps) {
  const [isInviteCopied, setIsInviteCopied] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['participants', hubSlug],
    queryFn: () => getHubParticipantsService(hubSlug),
  });

  const handleInviteLinkCopyClick = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}${getInviteHubPath(hubSlug)}`
    );
    toast('Invite link copied');
    setIsInviteCopied(true);
    setTimeout(() => {
      setIsInviteCopied(false);
    }, 3000);
  };

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel>
          <SidebarGroupAction className="w-full">
            <AppSidebarDropdownTrigger>Participants</AppSidebarDropdownTrigger>

            <Button
              size="icon-sm"
              variant="ghost"
              onClick={handleInviteLinkCopyClick}
            >
              {isInviteCopied ? <Check /> : <Link2 />}
            </Button>
          </SidebarGroupAction>
        </SidebarGroupLabel>
        <CollapsibleContent className="mt-2">
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading && <span className="px-2">Loading...</span>}
              {data && data.length === 0 && (
                <span className="px-2">No participants yet</span>
              )}
              {!isLoading &&
                data?.map((user) => (
                  <SidebarMenuItem key={user.id}>
                    <Dialog>
                      <DialogTrigger asChild>
                        <SidebarMenuButton>
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <Avatar className="size-7">
                                <AvatarImage
                                  src={
                                    user.avatar
                                      ? getFileUrl(user.avatar)
                                      : undefined
                                  }
                                  alt={user.displayName}
                                />
                                <AvatarFallback>
                                  {user.displayName[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <UserStatusIndicator userId={user.id} />
                            </div>
                            <span>{user.displayName}</span>
                          </div>
                        </SidebarMenuButton>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Profile</DialogTitle>
                          <DialogDescription className="sr-only">
                            Profile
                          </DialogDescription>
                        </DialogHeader>
                        <UserInfo userId={user.id} />
                      </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover>
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right">
                        <DropdownMenuItem>test</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
