import { User, UserStatus } from '@/types/user';
import { Badge } from './ui/badge';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserService } from '@/services/get-user.service';
import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { cn } from '@/lib/utils';

interface UserStatusIndicatorProps {
  userId: string;
  className?: string;
}

export default function UserStatusIndicator({
  userId,
  className,
}: UserStatusIndicatorProps) {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUserService(userId),
  });

  useEffect(() => {
    const handleStatusChange = (user: User) => {
      if (user.id === userId) {
        queryClient.setQueryData<User>(['users', userId], () => user);
      }
    };

    socket.emit('subscribeUserStatusUpdate', {
      userId,
    });
    socket.on('userStatusUpdate', handleStatusChange);

    return () => {
      socket.off('userStatusUpdate', handleStatusChange);
      socket.emit('unsubscribeUserStatusUpdate', {
        userId,
      });
    };
  }, [queryClient, userId]);

  if (!data || data.status === UserStatus.OFFLINE) {
    return null;
  }

  return (
    <Badge
      size="dot"
      className={cn(
        'absolute bottom-0.5 right-0.5 border border-secondary',
        className
      )}
    />
  );
}
