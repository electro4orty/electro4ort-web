import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Rooms from './rooms';
import { useParams } from 'react-router-dom';
import HubsDropdown from './hubs-dropdown';
import UserDropdown from './user-dropdown';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import CreateHub from '@/features/hubs/components/create-hub';
import Participants from './participants';
import { useState } from 'react';
import HubsSearch from './hubs-search';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
} from '@/components/ui/responsive-dialog';

export default function AppSidebar() {
  const { hubSlug } = useParams();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isCreateHubDialogOpen, setIsCreateHubDialogOpen] = useState(false);

  if (isSearchActive) {
    return <HubsSearch onClose={() => setIsSearchActive(false)} />;
  }

  return (
    <Sidebar>
      {hubSlug && (
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex gap-1">
                <HubsDropdown />

                <Button
                  size="icon"
                  variant="ghost"
                  className="shrink-0 size-8"
                  onClick={() => setIsCreateHubDialogOpen(true)}
                >
                  <Plus className="size-4" />
                </Button>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="shrink-0 size-8"
                  onClick={() => setIsSearchActive(true)}
                >
                  <Search className="size-4" />
                </Button>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      )}

      <SidebarContent>
        {hubSlug ? (
          <>
            <Participants hubSlug={hubSlug} />
            <Rooms hubSlug={hubSlug} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p>No hubs yet</p>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserDropdown />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <ResponsiveDialog
        open={isCreateHubDialogOpen}
        onOpenChange={setIsCreateHubDialogOpen}
      >
        <ResponsiveDialogContent>
          <CreateHub onClose={() => setIsCreateHubDialogOpen(false)} />
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </Sidebar>
  );
}
