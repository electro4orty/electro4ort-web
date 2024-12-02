import { useQuery } from '@tanstack/react-query';
import { getUserService } from '../services/get-user-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import EditUserForm from './edit-user-form';
import { getFileUrl } from '@/utils/get-file-url';
import { differenceInYears } from 'date-fns';

interface UserInfoProps {
  userId: string;
}

export default function UserInfo({ userId }: UserInfoProps) {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUserService(userId),
  });

  if (!data || !user) {
    return null;
  }

  const isAuthUser = user.id === data.id;

  if (isEditing) {
    return (
      <EditUserForm
        user={data}
        onCancel={() => setIsEditing(false)}
        onSaved={() => {
          refetch();
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Avatar className="size-12">
            <AvatarImage
              src={data.avatar ? getFileUrl(data.avatar) : undefined}
              alt={data.displayName}
            />
            <AvatarFallback>{data.displayName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg">{data.displayName}</p>
            <p className="text-muted-foreground text-sm leading-none">
              @{data.username}
            </p>
          </div>
        </div>

        <div>
          {isAuthUser && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="size-4 mr-2" />
              Edit profile
            </Button>
          )}
        </div>
      </div>
      {data.birthDate && (
        <span>{differenceInYears(new Date(), data.birthDate)} year(s)</span>
      )}
    </div>
  );
}
