import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { joinHubService } from '../services/join-hub.service';
import { getDashboardPath, getHubPath } from '@/app/constants/router-paths';
import { getHubService } from '../services/get-hub.service';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function InviteHubScreen() {
  const { hubSlug } = useParams();

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['hubs', hubSlug],
    queryFn: () => (hubSlug ? getHubService(hubSlug) : null),
    enabled: !!hubSlug,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: joinHubService,
    onSuccess: (data) => {
      navigate(getHubPath(data.slug));
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen text-center">
      <h2 className="text-xl">You have been invited to join:</h2>
      <h1 className="text-2xl font-semibold mb-3">{data?.name}</h1>

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => hubSlug && mutate(hubSlug)}
          disabled={isPending}
        >
          Join
        </Button>
        <Button asChild variant="secondary">
          <Link to={getDashboardPath()}>Discard</Link>
        </Button>
      </div>
    </div>
  );
}
