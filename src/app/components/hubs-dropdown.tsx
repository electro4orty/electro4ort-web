import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { getJoinedHubsService } from '@/features/hubs/services/get-joined-hubs.service';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import { NavLink, useParams } from 'react-router-dom';
import { getHubPath } from '../constants/router-paths';
import { getHubService } from '@/features/hubs/services/get-hub.service';
import { useEffect } from 'react';

export default function HubsDropdown() {
  const { hubSlug } = useParams();

  const { data: hubs } = useQuery({
    queryKey: ['hubs'],
    queryFn: getJoinedHubsService,
  });

  const { data: activeHub, refetch } = useQuery({
    queryKey: ['activeHub'],
    queryFn: () => (hubSlug ? getHubService(hubSlug) : undefined),
    enabled: !!hubSlug,
  });

  useEffect(() => {
    refetch();
  }, [hubSlug, refetch]);

  if (!activeHub) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <SidebarMenuButton role="combobox">
          {activeHub.name}
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
        <Command>
          <CommandInput placeholder="Select hub..." />
          <CommandList>
            <CommandEmpty>No hubs found</CommandEmpty>
            {hubs && (
              <CommandGroup>
                {hubs.map((hub) => (
                  <CommandItem key={hub.id} asChild>
                    <NavLink to={getHubPath(hub.slug)}>
                      {hub.id === activeHub.id && (
                        <Check className="size-4 mr-2" />
                      )}
                      {hub.name}
                    </NavLink>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
