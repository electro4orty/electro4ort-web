import { cn } from '@/lib/utils';
import {
  CollapsibleTrigger,
  CollapsibleTriggerProps,
} from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';

export function AppSidebarDropdownTrigger({
  children,
  className,
  ...props
}: CollapsibleTriggerProps & React.RefAttributes<HTMLButtonElement>) {
  return (
    <CollapsibleTrigger
      className={cn(
        'grow flex items-center justify-between gap-2 py-2 mr-1 lg:hover:text-white transition-colors',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="transition-transform group-data-[state=open]/collapsible:rotate-180 size-4" />
    </CollapsibleTrigger>
  );
}
