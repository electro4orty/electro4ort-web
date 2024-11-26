import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { Message, MessageType } from '@/types/message';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserStatusIndicator from '@/components/user-status-indicator';
import { getFileUrl } from '@/utils/get-file-url';
import TiktokMessage from './tiktok-message';
import GifMessage from './gif-message';
import AudioMessage from './audio-message';
import Attachments from './attachments';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useAuthStore();

  const isMine = user && message.authorId === user.id;

  const isTiktok = message.body.includes('tiktok.com');

  if (isTiktok) {
    return <TiktokMessage url={message.body} />;
  }

  let content = (
    <>
      {message.attachments && message.attachments.length !== 0 && (
        <Attachments attachments={message.attachments} />
      )}
      <div
        dangerouslySetInnerHTML={{ __html: message.body }}
        className="mb-1 break-dance text-lg md:text-base [&_a]:underline"
      />
    </>
  );

  if (message.type === MessageType.GIF) {
    content = <GifMessage url={message.body} />;
  }

  if (message.type === MessageType.AUDIO) {
    content = <AudioMessage fileName={message.body} />;
  }

  return (
    <div
      className={cn(
        'flex self-start gap-2 md:max-w-[80%] bg-neutral-900 rounded-lg pl-2 pr-3 py-1',
        isMine &&
          'self-end xl:self-start flex-row-reverse xl:flex-row pl-3 pr-2 bg-neutral-800'
      )}
    >
      <div className="py-1.5">
        <div className="relative">
          <Avatar>
            <AvatarImage
              src={
                message.author.avatar
                  ? getFileUrl(message.author.avatar)
                  : undefined
              }
              alt={message.author.displayName}
              className="size-10"
            />
            <AvatarFallback>
              {message.author.displayName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <UserStatusIndicator status={message.author.status} />
        </div>
      </div>
      <div className="flex flex-col max-w-full">
        <h5 className="font-semibold text-sm text-muted-foreground">
          {message.author.displayName}
        </h5>
        {content}
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
