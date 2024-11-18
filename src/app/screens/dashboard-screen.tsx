import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHubPath } from '../../constants/router-paths';
import { Button } from '@/components/ui/button';
import { getJoinedHubsService } from '@/features/hubs/services/get-joined-hubs.service';
import JoinHub from '@/features/hubs/components/join-hub';
import CreateHub from '@/features/hubs/components/create-hub';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState } from 'react';

export default function DashboardScreen() {
  const { data } = useQuery({
    queryKey: ['hubs'],
    queryFn: getJoinedHubsService,
  });
  const [isCreateHubDialogOpen, setIsCreateHubDialogOpen] = useState(false);
  const [isJoinHubDialogOpen, setIsJoinHubDialogOpen] = useState(false);

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

        <Dialog
          open={isJoinHubDialogOpen}
          onOpenChange={setIsJoinHubDialogOpen}
        >
          <DialogContent>
            <JoinHub onClose={() => setIsJoinHubDialogOpen(false)} />
          </DialogContent>
        </Dialog>
        <Dialog
          open={isCreateHubDialogOpen}
          onOpenChange={setIsCreateHubDialogOpen}
        >
          <DialogContent>
            <CreateHub onClose={() => setIsCreateHubDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return <Navigate to={getHubPath(data[0].slug)} />;
}
