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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, Plus } from 'lucide-react';
import CreateRoom from '@/features/rooms/components/create-room';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState } from 'react';

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
        <SidebarGroupLabel className="p-0">
          <SidebarGroupAction className="w-full">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between gap-2 p-2 mr-1 lg:hover:text-white transition-colors"
              >
                <span>Rooms</span>
                <ChevronDown className="transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </button>
            </CollapsibleTrigger>

            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setIsCreateRoomDialogOpen(true)}
            >
              <Plus />
            </Button>

            <Dialog
              open={isCreateRoomDialogOpen}
              onOpenChange={setIsCreateRoomDialogOpen}
            >
              <DialogContent>
                <CreateRoom
                  hubSlug={hubSlug}
                  onClose={() => setIsCreateRoomDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
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
