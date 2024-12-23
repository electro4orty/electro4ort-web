import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMessageService } from '../../services/create-message.service';
import { useAuthStore } from '@/store/auth-store';
import { Check, Send, X } from 'lucide-react';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { uploadFilesService } from '../../services/upload-files.service';
import { appendMessage } from '../../utils/append-message';
import { User } from '@/types/user';
import { socket } from '@/lib/socket';
import { useDebounce } from 'use-debounce';
import GifSelector from './gif-selector';
import { Message, MessageType } from '@/types/message';
import Editor from './editor';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useLongPress } from '@/hooks/use-long-press';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import AudioRecorder from './audio-recorder';
import VideoRecorder from './video-recorder';
import ShortcutsHelper from './shortcuts-helper';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AddDropdown from './add-dropdown';
import UploadFilesForm from './upload-files-form';
import { editMessageService } from '../../services/edit-message.service';
import { editMessage } from '../../utils/edit-message';

const getTextFromMarkdown = (markdown: string) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(
    DOMPurify.sanitize(
      marked.parse(markdown, {
        async: false,
      })
    ),
    'text/html'
  );
  const text = document.body.textContent ?? 'New message';
  return text;
};

interface ChatEditorProps {
  roomId: string;
  onSend: () => void;
  replyMessage: Message | null;
  onReplyClear: () => void;
  editedMessage: Message | null;
  onEditedClear: () => void;
}

export default function ChatEditor({
  roomId,
  onSend,
  replyMessage,
  onReplyClear,
  editedMessage,
  onEditedClear,
}: ChatEditorProps) {
  const { user } = useAuthStore();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isGifDialogOpen, setIsGifDialogOpen] = useState(false);
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [typingUser, setTypingUser] = useState<User | null>(null);
  const [debouncedTypingUser] = useDebounce(typingUser, 100);
  const [message, setMessage] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [pastedFiles, setPastedFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (editedMessage) {
      setMessage(editedMessage.body);
    }
  }, [editedMessage]);

  const onLongPressSend = useCallback(() => {
    setIsPreview(true);
  }, []);

  const { onTouchEnd: longPressSendOnTouchEnd, ...longPressSendProps } =
    useLongPress(onLongPressSend);

  useEffect(() => {
    const handleTyping = (user: User) => {
      setTypingUser(user);
    };

    const handleTypingStopped = () => {
      setTypingUser(null);
    };

    socket.on('typing', handleTyping);
    socket.on('typingStopped', handleTypingStopped);

    return () => {
      socket.off('typing', handleTyping);
      socket.off('typingStopped', handleTypingStopped);
    };
  });

  const handleMessageSendSuccess = (message: Message) => {
    appendMessage(queryClient, message);
    setIsGifDialogOpen(false);
    setIsAudioDialogOpen(false);
    setIsVideoDialogOpen(false);
    setIsUploadDialogOpen(false);
    onSend();
  };

  const handleMessageEditSuccess = (
    message: Omit<Message, 'attachments' | 'author' | 'replyTo'>
  ) => {
    editMessage(queryClient, message);
    setIsGifDialogOpen(false);
    setIsAudioDialogOpen(false);
    setIsVideoDialogOpen(false);
    setIsUploadDialogOpen(false);
    onSend();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createMessageService,
    onSuccess: handleMessageSendSuccess,
  });

  const { mutate: editMutate, isPending: isEditPending } = useMutation({
    mutationFn: editMessageService,
    onSuccess: handleMessageEditSuccess,
  });

  const handleSubmit = () => {
    if (!user || !message.trim().length || isPending) {
      return;
    }

    const text = getTextFromMarkdown(message);

    if (editedMessage) {
      editMutate({
        body: message.trim(),
        messageId: editedMessage.id,
      });
      onEditedClear();
    } else {
      mutate({
        body: message.trim(),
        text,
        roomId,
        userId: user.id,
        attachments: null,
        type: MessageType.TEXT,
        replyToId: replyMessage?.id ?? null,
      });
    }

    setMessage('');
  };

  useEffect(() => {
    if (user) {
      socket.emit('type', { userId: user.id, roomId });
    }
  }, [message, roomId, user]);

  const { mutate: uploadFilesMutate, isPending: isUploadFilesPending } =
    useMutation({
      mutationFn: async ({ files, text }: { files: File[]; text: string }) => {
        if (!user) {
          throw new Error('Unauthorized');
        }

        const rawText = getTextFromMarkdown(text);

        const uploadedFiles = await uploadFilesService(files);
        const message = await createMessageService({
          attachments: uploadedFiles,
          body: text.trim(),
          roomId,
          text: rawText,
          type: MessageType.TEXT,
          userId: user.id,
          replyToId: replyMessage?.id ?? null,
        });

        return message;
      },
      onSuccess: handleMessageSendSuccess,
    });

  const handleGifSubmit = (url: string) => {
    if (user) {
      mutate({
        attachments: null,
        body: url,
        text: 'GIF',
        roomId,
        userId: user.id,
        type: MessageType.GIF,
        replyToId: replyMessage?.id ?? null,
      });
    }
  };

  const handleMediaPaste = (files: FileList) => {
    setPastedFiles(files);
    setIsUploadDialogOpen(true);
  };

  return (
    <div className="px-2 py-3">
      <div className="flex items-end gap-1 mb-1.5">
        <AddDropdown
          onAudioClick={() => setIsAudioDialogOpen(true)}
          onGifClick={() => setIsGifDialogOpen(true)}
          onUploadClick={() => setIsUploadDialogOpen(true)}
          onVideoClick={() => setIsVideoDialogOpen(true)}
        />
        <div className="grow self-stretch">
          {replyMessage && (
            <div className="bg-neutral-900 p-1 rounded-t-lg flex items-center gap-1">
              <Button
                size="icon-sm"
                type="button"
                className="size-5"
                variant="ghost"
                onClick={onReplyClear}
              >
                <X />
              </Button>
              <div className="text-sm">
                Reply to {replyMessage.author.displayName}
              </div>
            </div>
          )}
          {editedMessage && (
            <div className="bg-neutral-900 p-1 rounded-t-lg flex items-center gap-1">
              <Button
                size="icon-sm"
                type="button"
                className="size-5"
                variant="ghost"
                onClick={onEditedClear}
              >
                <X />
              </Button>
              <div className="text-sm">Editing message</div>
            </div>
          )}
          <Editor
            value={message}
            onChange={setMessage}
            onEnter={handleSubmit}
            isPreview={isPreview}
            onMediaPaste={handleMediaPaste}
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
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    longPressSendOnTouchEnd();
                    handleSubmit();
                  }}
                  disabled={!message.trim() || isPending || isEditPending}
                  {...longPressSendProps}
                >
                  {editedMessage ? <Check /> : <Send />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Long press to show preview</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="flex justify-between items-end min-h-3.5">
        <ShortcutsHelper />
        {debouncedTypingUser && (
          <p className="text-sm text-muted-foreground leading-none">
            {debouncedTypingUser.displayName} is typing
          </p>
        )}
      </div>

      <ResponsiveDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>File upload</ResponsiveDialogTitle>
            <ResponsiveDialogDescription className="sr-only">
              File upload
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <UploadFilesForm
            onSubmit={uploadFilesMutate}
            initialFiles={pastedFiles}
            isLoading={isUploadFilesPending}
          />
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <Dialog open={isGifDialogOpen} onOpenChange={setIsGifDialogOpen}>
        <DialogContent className="!h-[70vh]">
          <GifSelector onSelect={handleGifSubmit} />
        </DialogContent>
      </Dialog>

      <ResponsiveDialog
        open={isAudioDialogOpen}
        onOpenChange={setIsAudioDialogOpen}
      >
        <ResponsiveDialogContent>
          {user && (
            <AudioRecorder
              roomId={roomId}
              userId={user.id}
              sendMessage={mutate}
              isSending={isPending}
            />
          )}
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={isVideoDialogOpen}
        onOpenChange={setIsVideoDialogOpen}
      >
        <ResponsiveDialogContent>
          {user && (
            <VideoRecorder
              roomId={roomId}
              userId={user.id}
              sendMessage={mutate}
              isSending={isPending}
            />
          )}
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </div>
  );
}
