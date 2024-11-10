import { useForm } from 'react-hook-form';
import { useRef, useState } from 'react';
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

interface ChatEditorFormData {
  message: string;
}

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
  });
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [attachments, setAttachments] =
    useState<CreateMessageDTO['attachments']>(null);
  const queryClient = useQueryClient();

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
          className="flex gap-1 mb-1.5 grow"
        >
          <Textarea
            placeholder="Write a message"
            className="resize-none max-h-40"
            rows={1}
            onKeyDown={handleTextareaKeyDown}
            onChange={(e) => {
              handleTextareaKeyUp(e);
              onChange(e);
            }}
            {...messageProps}
          />
          <Button type="submit" size="sm">
            Send
          </Button>
        </form>
      </div>

      <div className="text-sm">
        <Badge variant="secondary" className="rounded-xl px-1 py-0.5">
          Enter
        </Badge>{' '}
        - Send,{' '}
        <Badge variant="secondary" className="rounded-xl px-1 py-0.5">
          Shift + Enter
        </Badge>{' '}
        - New line
      </div>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File upload</DialogTitle>
            <DialogDescription>File upload</DialogDescription>
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
            <div className="mb-2">
              <Input type="file" name="files" multiple />
            </div>
            <Button type="submit">Upload</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
