import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { getHubRoomsService } from '@/features/hubs/services/get-hub-rooms.service';
import { useQuery } from '@tanstack/react-query';
import { roomTypeIcons } from '../constants/room-type-icons';
import { Badge } from '@/components/ui/badge';
import { NavLink } from 'react-router-dom';
import { getRoomPath } from '../../constants/router-paths';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateRoom from '@/features/rooms/components/create-room';
import { useState } from 'react';
import { AppSidebarDropdownTrigger } from './app-sidebar-dropdown-trigger';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
} from '@/components/ui/responsive-dialog';

const skeletons = Array.from({ length: 5 }).map((_, index) => (
  <SidebarMenuItem key={index}>
    <SidebarMenuSkeleton showIcon />
  </SidebarMenuItem>
));

interface RoomsProps {
  hubSlug: string;
}

export default function Rooms({ hubSlug }: RoomsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => getHubRoomsService(hubSlug),
  });

  const [isCreateRoomDialogOpen, setIsCreateRoomDialogOpen] = useState(false);

  return (
    <Collapsible className="group/collapsible" defaultOpen>
      <SidebarGroup>
        <SidebarGroupLabel>
          <SidebarGroupAction className="w-full">
            <AppSidebarDropdownTrigger>Rooms</AppSidebarDropdownTrigger>

            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setIsCreateRoomDialogOpen(true)}
            >
              <Plus />
            </Button>

            <ResponsiveDialog
              open={isCreateRoomDialogOpen}
              onOpenChange={setIsCreateRoomDialogOpen}
            >
              <ResponsiveDialogContent>
                <CreateRoom
                  hubSlug={hubSlug}
                  onClose={() => setIsCreateRoomDialogOpen(false)}
                />
              </ResponsiveDialogContent>
            </ResponsiveDialog>
          </SidebarGroupAction>
        </SidebarGroupLabel>
        <CollapsibleContent className="mt-2">
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading && skeletons}
              {data && data.length === 0 && (
                <span className="px-2">No rooms yet</span>
              )}
              {!isLoading &&
                data?.map((room) => {
                  const RoomIcon = roomTypeIcons[room.type];

                  return (
                    <SidebarMenuItem key={room.id}>
                      <SidebarMenuButton
                        asChild
                        className="[&.active]:bg-secondary"
                      >
                        <NavLink to={getRoomPath(hubSlug, room.id)}>
                          <RoomIcon />
                          <span>{room.name}</span>
                        </NavLink>
                      </SidebarMenuButton>
                      <SidebarMenuBadge>
                        <Badge size="dot" />
                      </SidebarMenuBadge>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
