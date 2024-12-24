import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHubPath } from '../../constants/router-paths';
import { Button } from '@/components/ui/button';
import { getJoinedHubsService } from '@/features/hubs/services/get-joined-hubs.service';
import JoinHub from '@/features/hubs/components/join-hub';
import CreateHub from '@/features/hubs/components/create-hub';
import { useState } from 'react';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
} from '@/components/ui/responsive-dialog';
import { useSettingsStore } from '@/store/settings-store';

export default function DashboardScreen() {
  const { data } = useQuery({
    queryKey: ['hubs'],
    queryFn: getJoinedHubsService,
  });
  const [isCreateHubDialogOpen, setIsCreateHubDialogOpen] = useState(false);
  const [isJoinHubDialogOpen, setIsJoinHubDialogOpen] = useState(false);
  const { lastVisited } = useSettingsStore();

  if (!data || data.length === 0) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-3">Welcome!</h1>
        <div className="flex items-center justify-center gap-2">
          <Button type="button" onClick={() => setIsJoinHubDialogOpen(true)}>
            Join hub
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsCreateHubDialogOpen(true)}
          >
            Create hub
          </Button>
        </div>

        <ResponsiveDialog
          open={isJoinHubDialogOpen}
          onOpenChange={setIsJoinHubDialogOpen}
        >
          <ResponsiveDialogContent>
            <JoinHub onClose={() => setIsJoinHubDialogOpen(false)} />
          </ResponsiveDialogContent>
        </ResponsiveDialog>
        <ResponsiveDialog
          open={isCreateHubDialogOpen}
          onOpenChange={setIsCreateHubDialogOpen}
        >
          <ResponsiveDialogContent>
            <CreateHub onClose={() => setIsCreateHubDialogOpen(false)} />
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      </div>
    );
  }

  return (
    <Navigate
      to={getHubPath(lastVisited ? lastVisited.hubSlug : data[0].slug)}
    />
  );
}
