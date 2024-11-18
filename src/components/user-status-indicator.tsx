import { UserStatus } from '@/types/user';
import { Badge } from './ui/badge';

interface UserStatusIndicatorProps {
  status: UserStatus;
}

export default function UserStatusIndicator({
  status,
}: UserStatusIndicatorProps) {
  if (status === UserStatus.OFFLINE) {
    return null;
  }

  return (
    <Badge
      size="dot"
      className="absolute bottom-0.5 right-0.5 border border-secondary"
    />
  );
}
