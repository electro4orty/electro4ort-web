import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { Message, MessageType } from '@/types/message';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserStatusIndicator from '@/components/user-status-indicator';
import { getFileUrl } from '@/utils/get-file-url';
import { useEffect, useState } from 'react';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useAuthStore();
  const [tikTok, setTikTok] = useState<{
    embed_product_id: string;
    html: string;
  } | null>(null);

  const isMine = user && message.authorId === user.id;

  useEffect(() => {
    if (!message.body.includes('tiktok.com')) {
      return;
    }

    fetch(`https://www.tiktok.com/oembed?url=${message.body}`)
      .then((res) => res.json())
      .then((data) => {
        setTikTok(
          data as {
            embed_product_id: string;
            html: string;
          }
        );
      });
  }, [message.body]);

  let content = (
    <>
      {message.attachments && message.attachments.length !== 0 && (
        <div className="flex flex-wrap gap-1">
          {message.attachments
            .filter((attachment) => !!attachment)
            .map((attachment) => (
              <img
                key={attachment.fileName}
                src={getFileUrl(attachment.fileName)}
                className="block size-[120px] object-cover object-center overflow-hidden rounded-lg"
              />
            ))}
        </div>
      )}
      {tikTok ? (
        <div className="mb-1 break-dance max-w-[400px]">
          <iframe
            src={`https://www.tiktok.com/player/v1/${tikTok.embed_product_id}`}
            width={300}
            height={550}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: tikTok.html,
            }}
          ></div>
        </div>
      ) : (
        <p className="mb-1 break-dance">{message.body}</p>
      )}
    </>
  );

  if (message.type === MessageType.GIF) {
    content = <video src={message.body} autoPlay loop muted playsInline />;
  }

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
