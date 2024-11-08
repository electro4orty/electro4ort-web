import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHubPath } from '../constants/router-paths';
import { Button } from '@/components/ui/button';
import { getJoinedHubsService } from '@/features/hubs/services/get-joined-hubs-service';
import JoinHubDialog from '@/features/hubs/components/join-hub-dialog';
import CreateHubDialog from '@/features/hubs/components/create-hub-dialog';

export default function DashboardScreen() {
  const { data } = useQuery({
    queryKey: ['hubs'],
    queryFn: getJoinedHubsService,
  });

  if (!data || data.length === 0) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-3">Welcome!</h1>
        <div className="flex items-center justify-center gap-2">
          <JoinHubDialog trigger={<Button type="button">Join hub</Button>} />
          <CreateHubDialog
            trigger={
              <Button type="button" variant="secondary">
                Create hub
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return <Navigate to={getHubPath(data[0].slug)} />;
}
