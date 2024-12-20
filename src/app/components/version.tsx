import { useQuery } from '@tanstack/react-query';
import packageJson from '../../../package.json';
import { Button } from '@/components/ui/button';
import { getLatestReleaseService } from '../services/get-latest-release.service';
import { ExternalLink } from 'lucide-react';

export default function Version() {
  const { data } = useQuery({
    queryKey: ['releases', 'latest'],
    queryFn: getLatestReleaseService,
  });

  return (
    <Button
      variant="link"
      size="sm"
      className="h-auto min-w-0 text-muted-foreground p-0"
      asChild
    >
      <a href={data?.html_url} target="_blank" rel="noreferrer noopener">
        v{packageJson.version}
        <ExternalLink className="ml-1 size-3" />
      </a>
    </Button>
  );
}
