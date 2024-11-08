import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { Message } from '@/types/message';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useAuthStore();

  const isMine = user && message.authorId === user.id;

  return (
    <div
      key={message.id}
      className={cn(
        'flex gap-1.5 max-w-[80%]',
        isMine && 'self-end flex-row-reverse'
      )}
    >
      <div className="py-1.5">
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
      </div>
      <div>
        <h5 className="font-semibold text-sm text-muted-foreground">
          {message.author.displayName}
        </h5>
        <p>{message.body}</p>
      </div>
    </div>
  );
}
