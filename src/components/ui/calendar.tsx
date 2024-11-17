import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      captionLayout="dropdown-years"
      classNames={{
        months: 'relative',
        month: 'space-y-4',
        month_caption: 'flex justify-center pt-1 relative items-center',
        table: 'w-full border-collapse space-y-1',
        caption_label: 'hidden',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
        ),
        day_button: 'size-full',
        day_range_end: 'day-range-end',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today: 'bg-accent text-accent-foreground',
        outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        disabled: 'text-muted-foreground opacity-50',
        range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        hidden: 'invisible',
        week: 'flex',
        weekdays: 'flex',
        weekday:
          'size-9 text-center text-sm p-0 inline-flex justify-center items-center',
        ...classNames,
      }}
      components={{
        Nav: ({ onPreviousClick, onNextClick }) => (
          <div className="relative z-50">
            <Button
              size="icon-sm"
              variant="outline"
              className="absolute left-1"
              onClick={onPreviousClick}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              className="absolute right-1"
              onClick={onNextClick}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
