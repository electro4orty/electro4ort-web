import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateMessageDTO,
  createMessageService,
} from '../services/create-message.service';
import { useAuthStore } from '@/store/auth-store';
import { ImagePlay, Mic, Plus, Send, Upload, Video, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { uploadFilesService } from '../services/upload-file.service';
import { appendMessage } from '../utils/append-message';
import { User } from '@/types/user';
import { roomsSocket } from '@/lib/socket';
import { useDebounce } from 'use-debounce';
import GifSelector from './gif-selector';
import { MessageType } from '@/types/message';
import Editor from './editor';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLongPress } from '@/hooks/use-long-press';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import AudioRecorder from './audio-recorder';
import VideoRecorder from './video-recorder';

interface ChatEditorProps {
  roomId: string;
  onSend: () => void;
}

export default function ChatEditor({ roomId, onSend }: ChatEditorProps) {
  const { user } = useAuthStore();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isGifDialogOpen, setIsGifDialogOpen] = useState(false);
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [attachments, setAttachments] =
    useState<CreateMessageDTO['attachments']>(null);
  const queryClient = useQueryClient();
  const [typingUser, setTypingUser] = useState<User | null>(null);
  const [debouncedTypingUser] = useDebounce(typingUser, 100);
  const [message, setMessage] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const onLongPressSend = useCallback(() => {
    setIsPreview(true);
  }, []);

  const longPressSendProps = useLongPress(onLongPressSend);

  useEffect(() => {
    const handleTyping = (user: User) => {
      setTypingUser(user);
    };

    const handleTypingStopped = () => {
      setTypingUser(null);
    };

    roomsSocket.on('typing', handleTyping);
    roomsSocket.on('typingStopped', handleTypingStopped);

    return () => {
      roomsSocket.off('typing', handleTyping);
      roomsSocket.off('typingStopped', handleTypingStopped);
    };
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createMessageService,
    onSuccess: (message) => {
      appendMessage(queryClient, message);
      setIsGifDialogOpen(false);
      setIsAudioDialogOpen(false);
      setIsVideoDialogOpen(false);
      onSend();
    },
  });

  const handleSubmit = () => {
    if (!user) {
      return;
    }

    const parser = new DOMParser();
    const document = parser.parseFromString(
      DOMPurify.sanitize(
        marked.parse(message, {
          async: false,
        })
      ),
      'text/html'
    );
    const text = document.body.textContent ?? 'New message';

    mutate({
      body: message.trim(),
      text,
      roomId,
      userId: user.id,
      attachments,
      type: MessageType.TEXT,
    });
    setAttachments(null);
    setMessage('');
  };

  useEffect(() => {
    if (user) {
      roomsSocket.emit('type', { userId: user.id, roomId });
    }
  }, [message, roomId, user]);

  return (
    <div className="px-2 py-3">
      {attachments && attachments.length !== 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {attachments.map((attachment) => (
            <div key={attachment.fileName} className="relative group">
              <img
                src={`${process.env.VITE_API_URL}/api/attachments/${attachment.fileName}`}
                className="block size-[80px] object-cover object-center overflow-hidden rounded-lg"
              />
              <button
                type="button"
                className="absolute inset-0 hidden group-hover:flex justify-center items-center bg-black/50"
                onClick={() =>
                  setAttachments((prev) =>
                    prev
                      ? prev.filter(
                          (item) => item.fileName !== attachment.fileName
                        )
                      : null
                  )
                }
              >
                <X />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-1 mb-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" size="icon" variant="ghost">
              <Plus className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="size-4 mr-2" />
              Upload attachments
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsGifDialogOpen(true)}>
              <ImagePlay className="size-4 mr-2" />
              Send GIFs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsAudioDialogOpen(true)}>
              <Mic className="size-4 mr-2" />
              Record audio
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsVideoDialogOpen(true)}>
              <Video className="size-4 mr-2" />
              Record video
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="grow self-stretch">
          <Editor
            value={message}
            onChange={setMessage}
            onEnter={handleSubmit}
            isPreview={isPreview}
          />
        </div>
        <div className="flex gap-1 items-end">
          {isPreview ? (
            <Button
              type="button"
              size="icon"
              onClick={() => setIsPreview(false)}
              onContextMenu={(e) => e.preventDefault()}
            >
              <X className="size-4" />
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  onClick={handleSubmit}
                  disabled={
                    (message.trim().length === 0 &&
                      (!attachments || attachments.length === 0)) ||
                    isPending
                  }
                  {...longPressSendProps}
                >
                  <Send className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Long press to show preview</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="flex justify-between items-end min-h-3.5">
        <div className="text-sm hidden md:block">
          <Badge variant="secondary" className="rounded-xl px-1 py-0.5">
            Enter
          </Badge>{' '}
          - Send,{' '}
          <Badge variant="secondary" className="rounded-xl px-1 py-0.5">
            Shift + Enter
          </Badge>{' '}
          - New line
        </div>
        {debouncedTypingUser && (
          <p className="text-sm text-muted-foreground leading-none">
            {debouncedTypingUser.displayName} is typing
          </p>
        )}
      </div>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File upload</DialogTitle>
            <DialogDescription className="sr-only">
              File upload
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              uploadFilesService(roomId, new FormData(e.currentTarget)).then(
                (res) => {
                  setAttachments((prev) => (prev ? [...prev, ...res] : res));
                  setIsUploadDialogOpen(false);
                }
              );
            }}
          >
            <div className="mb-3">
              <Input type="file" name="files" accept="image/*" multiple />
              <p className="text-muted-foreground text-sm mt-1">Max: 5mb</p>
            </div>
            <Button type="submit">Upload</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isGifDialogOpen} onOpenChange={setIsGifDialogOpen}>
        <DialogContent>
          <GifSelector
            onSelect={(url) =>
              user &&
              mutate({
                attachments: null,
                body: url,
                text: 'GIF',
                roomId,
                userId: user.id,
                type: MessageType.GIF,
              })
            }
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isAudioDialogOpen} onOpenChange={setIsAudioDialogOpen}>
        <DialogContent>
          {user && (
            <AudioRecorder
              roomId={roomId}
              userId={user.id}
              sendMessage={mutate}
              isSending={isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent>
          {user && (
            <VideoRecorder
              roomId={roomId}
              userId={user.id}
              sendMessage={mutate}
              isSending={isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
