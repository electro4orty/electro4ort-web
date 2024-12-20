import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AttachmentDTO,
  createMessageService,
} from '../services/create-message.service';
import { useAuthStore } from '@/store/auth-store';
import { Send, X } from 'lucide-react';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { Input } from '@/components/ui/input';
import { uploadFilesService } from '../services/upload-files.service';
import { appendMessage } from '../utils/append-message';
import { User } from '@/types/user';
import { socket } from '@/lib/socket';
import { useDebounce } from 'use-debounce';
import GifSelector from './gif-selector';
import { MessageType } from '@/types/message';
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
import AttachmentsPreview from './attachments-preview';

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
  const [attachments, setAttachments] = useState<AttachmentDTO[] | null>(null);
  const queryClient = useQueryClient();
  const [typingUser, setTypingUser] = useState<User | null>(null);
  const [debouncedTypingUser] = useDebounce(typingUser, 100);
  const [message, setMessage] = useState('');
  const [isPreview, setIsPreview] = useState(false);

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
    if (
      !user ||
      (message.trim().length === 0 &&
        (!attachments || attachments.length === 0)) ||
      isPending
    ) {
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
      socket.emit('type', { userId: user.id, roomId });
    }
  }, [message, roomId, user]);

  const { mutate: uploadFilesMutate } = useMutation({
    mutationFn: uploadFilesService,
    onSuccess: (data) => {
      setAttachments((prev) => (prev ? [...prev, ...data] : data));
      setIsUploadDialogOpen(false);
    },
  });

  const handleMediaPaste = (files: FileList) => {
    uploadFilesMutate(files);
  };

  const handleUploadFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputElem = e.currentTarget.elements.namedItem(
      'files'
    ) as HTMLInputElement;
    const { files } = inputElem;
    if (files) {
      uploadFilesMutate(files);
    }
  };

  const handleGifSubmit = (url: string) => {
    if (user) {
      mutate({
        attachments: null,
        body: url,
        text: 'GIF',
        roomId,
        userId: user.id,
        type: MessageType.GIF,
      });
    }
  };

  const removeAttachment = (attachment: AttachmentDTO) => {
    setAttachments((prev) =>
      prev ? prev.filter((item) => item.fileName !== attachment.fileName) : null
    );
  };

  return (
    <div className="px-2 py-3">
      {attachments && attachments.length !== 0 && (
        <AttachmentsPreview
          attachments={attachments}
          onRemove={removeAttachment}
        />
      )}

      <div className="flex items-end gap-1 mb-1.5">
        <AddDropdown
          onAudioClick={() => setIsAudioDialogOpen(true)}
          onGifClick={() => setIsGifDialogOpen(true)}
          onUploadClick={() => setIsUploadDialogOpen(true)}
          onVideoClick={() => setIsVideoDialogOpen(true)}
        />
        <div className="grow self-stretch">
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
          <form onSubmit={handleUploadFormSubmit}>
            <div className="mb-3">
              <Input type="file" name="files" accept="image/*" multiple />
              <p className="text-muted-foreground text-sm mt-1">Max: 5mb</p>
            </div>
            <Button type="submit">Upload</Button>
          </form>
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
