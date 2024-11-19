import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateMessageDTO,
  createMessageService,
} from '../services/create-message.service';
import { useAuthStore } from '@/store/auth-store';
import { ImagePlay, Upload, X } from 'lucide-react';
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

interface ChatEditorProps {
  roomId: string;
  onSend: () => void;
}

export default function ChatEditor({ roomId, onSend }: ChatEditorProps) {
  const { user } = useAuthStore();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isGifDialogOpen, setIsGifDialogOpen] = useState(false);
  const [attachments, setAttachments] =
    useState<CreateMessageDTO['attachments']>(null);
  const queryClient = useQueryClient();
  const [typingUser, setTypingUser] = useState<User | null>(null);
  const [debouncedTypingUser] = useDebounce(typingUser, 100);
  const editorRef = useRef<{
    getHtml: () => { html: string; text: string };
    clear: () => void;
  }>(null);

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

  const { mutate } = useMutation({
    mutationFn: createMessageService,
    onSuccess: (message) => {
      appendMessage(queryClient, message);
      setIsGifDialogOpen(false);
      onSend();
    },
  });

  const handleSubmit = () => {
    if (!user) {
      return;
    }

    const message = editorRef.current?.getHtml();
    if (!message?.html) {
      return;
    }

    mutate({
      body: message.html,
      text: message.text,
      roomId,
      userId: user.id,
      attachments,
      type: MessageType.TEXT,
    });
    setAttachments(null);
    editorRef.current?.clear();
  };

  const handleType = () => {
    if (user) {
      roomsSocket.emit('type', { userId: user.id, roomId });
    }
  };

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
        <div className="h-[42px] flex items-center">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsUploadDialogOpen(true)}
          >
            <Upload className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsGifDialogOpen(true)}
          >
            <ImagePlay className="size-4" />
          </Button>
        </div>
        <div className="grow">
          <Editor
            editorRef={editorRef}
            onChange={handleType}
            onEnter={handleSubmit}
          />
        </div>
        <div className="flex h-[42px]">
          <Button
            type="button"
            className="h-full"
            size="sm"
            onClick={handleSubmit}
          >
            Send
          </Button>
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
                  setAttachments(res);
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
    </div>
  );
}
