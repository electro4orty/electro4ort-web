import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const skeletonsData = Array.from({ length: 20 });

export default function ChatMessagesSkeletons() {
  return (
    <>
      {skeletonsData.map((_, i) => {
        const isMine = Math.random() > 0.5;

        return (
          <Skeleton
            key={i}
            className={cn('h-[74px] w-[30%]', isMine && 'self-end')}
          />
        );
      })}
    </>
  );
}
