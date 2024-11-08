import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { searchHubsService } from '@/features/hubs/services/search-hubs-service';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

interface HubsSearchProps {
  onClose: () => void;
}

export default function HubsSearch({ onClose }: HubsSearchProps) {
  const form = useForm({
    defaultValues: {
      query: '',
    },
  });

  const query = form.watch('query');

  const [debouncedQuery] = useDebounce(query, 300);

  const { data, refetch } = useQuery({
    queryKey: ['hubs-search'],
    queryFn: () => searchHubsService(debouncedQuery),
    enabled: !!debouncedQuery,
  });

  useEffect(() => {
    if (debouncedQuery) {
      refetch();
    }
  }, [debouncedQuery, refetch]);

  const clearQuery = () => {
    form.resetField('query');
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex gap-1 items-center">
            <Button
              type="button"
              size="icon"
              className="size-8 shrink-0"
              onClick={onClose}
              variant="ghost"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <div className="relative grow">
              <Input
                placeholder="Search"
                type="text"
                autoComplete="off"
                className="bg-muted py-1 h-8 border-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:ring-offset-transparent focus-visible:bg-zinc-700"
                {...form.register('query')}
              />
              <Button
                type="button"
                size="icon"
                className="size-6 absolute right-1 top-1/2 -translate-y-1/2 hover:bg-zinc-600"
                variant="ghost"
                onClick={clearQuery}
              >
                <X className="size-3" />
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Search results</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data?.map((hub) => (
                <SidebarMenuItem key={hub.id}>
                  <SidebarMenuButton type="button">
                    {hub.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
