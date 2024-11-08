import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMessageService } from '../services/create-message.service';
import { useAuthStore } from '@/store/auth-store';

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
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex gap-1 mb-1.5"
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
    </div>
  );
}
