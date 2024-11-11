import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { Message } from '@/types/message';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserStatusIndicator from '@/components/user-status-indicator';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useAuthStore();

  const isMine = user && message.authorId === user.id;

  return (
    <div
      className={cn(
        'flex self-start gap-2 max-w-[80%] bg-neutral-900 rounded-lg pl-2 pr-3 py-1',
        isMine && 'self-end flex-row-reverse pl-3 pr-2'
      )}
    >
      <div className="py-1.5">
        <div className="relative">
          <Avatar>
            <AvatarImage
              src={message.author.avatar ?? undefined}
              alt={message.author.displayName}
              className="size-10 object-cover object-center rounded-full"
            />
            <AvatarFallback>
              {message.author.displayName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <UserStatusIndicator
            status={message.author.status}
            className="absolute bottom-0.5 right-0.5"
          />
        </div>
      </div>
      <div>
        <h5 className="font-semibold text-sm text-muted-foreground">
          {message.author.displayName}
        </h5>
        {message.attachments && message.attachments.length !== 0 && (
          <div className="flex flex-wrap gap-1">
            {message.attachments
              .filter((attachment) => !!attachment)
              .map((attachment) => (
                <img
                  key={attachment.fileName}
                  src={`${import.meta.env.VITE_API_URL}/api/attachments/${
                    attachment.fileName
                  }`}
                  className="block size-[120px] object-cover object-center overflow-hidden rounded-lg"
                />
              ))}
          </div>
        )}
        <p className="mb-1">{message.body}</p>
        <time
          dateTime={message.createdAt}
          className="text-sm text-muted-foreground leading-tight block"
        >
          {format(message.createdAt, 'dd.MM.yyyy HH:mm')}
        </time>
      </div>
    </div>
  );
}
