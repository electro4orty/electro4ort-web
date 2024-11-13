import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateMessageDTO,
  createMessageService,
} from '../services/create-message.service';
import { useAuthStore } from '@/store/auth-store';
import { Upload, X } from 'lucide-react';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDebounce } from 'use-debounce';

interface ChatEditorFormData {
  message: string;
}

const validationSchema = z.object({
  message: z.string().min(1).max(10000),
});

interface ChatEditorProps {
  roomId: string;
}

export default function ChatEditor({ roomId }: ChatEditorProps) {
  const { user } = useAuthStore();
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<ChatEditorFormData>({
    defaultValues: {
      message: '',
    },
    resolver: zodResolver(validationSchema),
  });
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [attachments, setAttachments] =
    useState<CreateMessageDTO['attachments']>(null);
  const queryClient = useQueryClient();
  const [typingUser, setTypingUser] = useState<User | null>(null);
  const [debouncedTypingUser] = useDebounce(typingUser, 100);

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
    },
  });

  const handleSubmit = (data: ChatEditorFormData) => {
    if (!user) {
      return;
    }

    mutate({
      body: data.message,
      roomId,
      userId: user.id,
      attachments,
    });
    form.reset();
    setAttachments(null);
  };

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter' && !e.shiftKey && formRef.current) {
      e.preventDefault();
      formRef.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    }
  };

  const handleTextareaKeyUp = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const elem = e.currentTarget;

    elem.style.height = '0';
    elem.style.height = `${elem.scrollHeight + 2}px`;
  };

  const { onChange, ...messageProps } = form.register('message');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleTextareaKeyUp(e);
    onChange(e);

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
                src={`${import.meta.env.VITE_API_URL}/api/attachments/${
                  attachment.fileName
                }`}
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

      <div className="flex gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsUploadDialogOpen(true)}
        >
          <Upload className="size-4" />
        </Button>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex items-center gap-2 mb-1.5 grow"
        >
          <Textarea
            placeholder="Write a message"
            className="resize-none max-h-40 focus-visible:ring-offset-0"
            rows={1}
            min={1}
            max={10000}
            onKeyDown={handleTextareaKeyDown}
            onChange={handleChange}
            {...messageProps}
          />
          <Button type="submit" className="h-full" size="sm">
            Send
          </Button>
        </form>
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
              <Input type="file" name="files" multiple />
              <p className="text-muted-foreground text-sm mt-1">Max: 5mb</p>
            </div>
            <Button type="submit">Upload</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
