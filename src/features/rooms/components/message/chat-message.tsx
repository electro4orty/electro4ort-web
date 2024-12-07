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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import UserInfo from '@/components/user-info';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import VideoMessage from './video-message';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useAuthStore();

  const isMine = user && message.authorId === user.id;

  const isTiktok = message.body.includes('tiktok.com');

  let content;

  if (isTiktok) {
    content = <TiktokMessage url={message.body} />;
  } else {
    if (message.type === MessageType.GIF) {
      content = <GifMessage url={message.body} />;
    } else if (message.type === MessageType.AUDIO) {
      content = <AudioMessage fileName={message.body} />;
    } else if (message.type === MessageType.VIDEO) {
      content = <VideoMessage fileName={message.body} />;
    } else {
      content = (
        <>
          {message.attachments && message.attachments.length !== 0 && (
            <Attachments attachments={message.attachments} />
          )}
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                marked.parse(message.body, {
                  async: false,
                }),
                {
                  ADD_ATTR: ['target'],
                }
              ),
            }}
            className="mb-1 markdown"
          />
        </>
      );
    }
  }

  return (
    <div
      className={cn(
        'self-start flex gap-2 md:max-w-[80%] bg-neutral-900 rounded-lg pl-2 pr-3 py-1 max-w-full',
        isMine &&
          'self-end xl:self-start flex-row-reverse xl:flex-row pl-3 pr-2 bg-neutral-800'
      )}
    >
      <div className="py-1.5">
        <Dialog>
          <DialogTrigger className="relative">
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
            <UserStatusIndicator userId={message.authorId} />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Profile</DialogTitle>
              <DialogDescription className="sr-only">Profile</DialogDescription>
            </DialogHeader>
            <UserInfo userId={message.authorId} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col max-w-[calc(100%-40px-0.5rem)]">
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
