import { UserStatus } from '@/types/user';
import { Badge } from './ui/badge';

interface UserStatusIndicatorProps {
  status: UserStatus;
  className?: string;
}

export default function UserStatusIndicator({
  status,
  className,
}: UserStatusIndicatorProps) {
  if (status === UserStatus.OFFLINE) {
    return null;
  }

  return <Badge size="dot" className={className} />;
}
