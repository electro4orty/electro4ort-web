import { useForm } from 'react-hook-form';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMessageService } from '../services/create-message.service';
import { useAuthStore } from '@/store/auth-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { File, Image, Plus, Video } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

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
  const queryClient = useQueryClient();
  const [uploadModalType, setUploadModalType] = useState<string | null>(null);

  const { mutate } = useMutation({
    mutationFn: createMessageService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rooms', roomId, 'messages'],
      });
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
    });
    form.reset();
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
      <div className="flex gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <Plus className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start">
            <DropdownMenuItem onClick={() => setUploadModalType('file')}>
              <File className="size-4 mr-2" />
              File
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUploadModalType('image')}>
              <Image className="size-4 mr-2" />
              Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUploadModalType('video')}>
              <Video className="size-4 mr-2" />
              Video
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

      <Dialog
        open={uploadModalType === 'file'}
        onOpenChange={(value) => setUploadModalType(value ? 'file' : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File upload</DialogTitle>
            <DialogDescription>File upload</DialogDescription>
          </DialogHeader>
          <form>
            <div className="mb-2">
              <Input type="file" />
            </div>
            <Button type="submit">Send</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={uploadModalType === 'image'}
        onOpenChange={(value) => setUploadModalType(value ? 'image' : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Image upload</DialogTitle>
            <DialogDescription>Image upload</DialogDescription>
          </DialogHeader>
          Image upload
        </DialogContent>
      </Dialog>
      <Dialog
        open={uploadModalType === 'video'}
        onOpenChange={(value) => setUploadModalType(value ? 'video' : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Video upload</DialogTitle>
            <DialogDescription>Video upload</DialogDescription>
          </DialogHeader>
          Video upload
        </DialogContent>
      </Dialog>
    </div>
  );
}
