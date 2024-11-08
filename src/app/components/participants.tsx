import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
import { getHubParticipantsService } from '@/features/hubs/services/get-hub-participants-service';
import { useQuery } from '@tanstack/react-query';
import { NavLink } from 'react-router-dom';
import { getHubPath } from '../constants/router-paths';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Link2, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useState } from 'react';

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
    await navigator.clipboard.writeText(getHubPath(hubSlug));
    toast('Invite link copied');
    setIsInviteCopied(true);
    setTimeout(() => {
      setIsInviteCopied(false);
    }, 3000);
  };

  return (
    <Collapsible defaultOpen>
      <SidebarGroup>
        <SidebarGroupLabel>
          Participants
          <SidebarGroupAction>
            <CollapsibleTrigger asChild>
              <Button size="icon-sm" variant="ghost">
                <ChevronDown className="transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </Button>
            </CollapsibleTrigger>

            <Button
              size="icon-sm"
              variant="ghost"
              onClick={handleInviteLinkCopyClick}
            >
              {isInviteCopied ? <Check /> : <Link2 />}
            </Button>
          </SidebarGroupAction>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading && <span className="px-2">Loading...</span>}
              {data && data.length === 0 && (
                <span className="px-2">No participants yet</span>
              )}
              {!isLoading &&
                data?.map((user) => (
                  <SidebarMenuItem key={user.id}>
                    <SidebarMenuButton asChild>
                      <NavLink to={getHubPath('')}>
                        <Avatar className="size-6">
                          <AvatarImage
                            src={user.avatar ?? undefined}
                            alt={user.displayName}
                          />
                          <AvatarFallback>
                            {user.displayName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {user.displayName}
                      </NavLink>
                    </SidebarMenuButton>
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
