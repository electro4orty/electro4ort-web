import { cn } from '@/lib/utils';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export function CollapsibleDropdownTrigger({
  children,
  className,
  ...props
}: CollapsiblePrimitive.CollapsibleTriggerProps &
  React.RefAttributes<HTMLButtonElement>) {
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

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
