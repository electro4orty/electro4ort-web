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
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog';
import UserInfo from '@/components/user-info';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import VideoMessage from './video-message';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Reply } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onReplyClick: (message: Message) => void;
  onEditClick: (message: Message) => void;
}

export default function ChatMessage({
  message,
  onReplyClick,
  onEditClick,
}: ChatMessageProps) {
  const { user } = useAuthStore();

  const isMine = user && message.authorId === user.id;

  const isTiktok = message.body.includes('tiktok.com');

  let content;

  const html = useMemo(
    () =>
      DOMPurify.sanitize(
        marked.parse(message.body, {
          async: false,
        }),
        {
          ADD_ATTR: ['target'],
        }
      ),
    [message.body]
  );

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
              __html: html,
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
        'flex flex-col self-start max-w-full md:max-w-[80%] bg-neutral-900 rounded-lg pl-2 pr-3 py-2',
        isMine && 'self-end pl-3 pr-2 bg-neutral-800'
      )}
    >
      {message.replyTo && (
        <div
          className={cn(
            'bg-neutral-800 px-2 py-0.5 rounded border-l-4 border-primary mb-1',
            isMine && 'bg-neutral-900'
          )}
        >
          {message.replyTo.body}
        </div>
      )}

      <div
        className={cn(
          'flex gap-2 w-full',
          isMine && 'xl:self-start flex-row-reverse xl:flex-row'
        )}
      >
        <div className="py-1.5">
          <ResponsiveDialog>
            <ResponsiveDialogTrigger className="relative">
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
            </ResponsiveDialogTrigger>
            <ResponsiveDialogContent>
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Profile</ResponsiveDialogTitle>
                <ResponsiveDialogDescription className="sr-only">
                  Profile
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>
              <UserInfo userId={message.authorId} />
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        </div>
        <div className="flex flex-col max-w-[calc(100%-40px-0.5rem)]">
          <h5 className="font-semibold text-sm text-muted-foreground">
            {message.author.displayName}
          </h5>
          {content}
          <time
            dateTime={message.createdAt}
            className="text-sm text-muted-foreground leading-tight block mb-1"
          >
            {format(message.createdAt, 'dd.MM.yyyy HH:mm')}
          </time>
          <div className="flex">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="px-1 h-5"
              onClick={() => onReplyClick(message)}
            >
              <Reply />
              Reply
            </Button>
            {isMine && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="px-1 h-5"
                onClick={() => onEditClick(message)}
              >
                <Pencil />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
