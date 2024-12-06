import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateMessageDTO,
  createMessageService,
} from '../services/create-message.service';
import { useAuthStore } from '@/store/auth-store';
import {
  ImagePlay,
  Mic,
  Plus,
  Send,
  Square,
  Upload,
  Video,
  X,
} from 'lucide-react';
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
import { Recorder } from '@/utils/recorder';
import { uploadAudioService } from '../services/upload-audio.service';
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
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const audioRecorderRef = useRef(
    new Recorder({
      audio: true,
    })
  );
  const videoRecorderRef = useRef(
    new Recorder({
      audio: true,
      video: true,
    })
  );
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [message, setMessage] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  const onLongPressSend = useCallback(() => {
    setIsPreview(true);
  }, []);

  const longPressSendProps = useLongPress(onLongPressSend);

  const onLongPressVoice = useCallback(() => {
    setIsVideo((prev) => !prev);
  }, []);

  const longPressVoiceProps = useLongPress(onLongPressVoice);

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

    if (recordedAudio) {
      uploadAudioService(recordedAudio).then((res) => {
        mutate({
          body: res.fileName,
          text: res.fileName,
          roomId,
          userId: user.id,
          attachments: [],
          type: MessageType.AUDIO,
        });
      });
      return;
    }

    if (recordedVideo) {
      uploadAudioService(recordedVideo).then((res) => {
        mutate({
          body: res.fileName,
          text: res.fileName,
          roomId,
          userId: user.id,
          attachments: [],
          type: MessageType.VIDEO,
        });
      });
      return;
    }

    if (!message.trim() || (!message.trim() && !attachments?.length)) {
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

  const startRecordingAudio = async () => {
    await audioRecorderRef.current.start();
    setRecordedAudio(null);
    setIsRecordingAudio(true);
  };

  const stopRecordingAudio = async () => {
    setIsRecordingAudio(false);

    const file = await audioRecorderRef.current.stop();
    setRecordedAudio(file);
  };

  const startRecordingVideo = async () => {
    await videoRecorderRef.current.start();
    setRecordedVideo(null);
    setIsRecordingVideo(true);
  };

  const stopRecordingVideo = async () => {
    setIsRecordingVideo(false);

    const file = await videoRecorderRef.current.stop();
    setRecordedVideo(file);
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isRecordingAudio}>
            <Button type="button" size="icon" variant="ghost">
              <Plus className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => setIsUploadDialogOpen(true)}
              disabled={isRecordingAudio}
            >
              <Upload className="size-4 mr-2" />
              Upload attachments
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsGifDialogOpen(true)}
              disabled={isRecordingAudio}
            >
              <ImagePlay className="size-4 mr-2" />
              Send GIFs
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="grow self-stretch">
          {(isRecordingAudio || isRecordingVideo) && <p>Recording...</p>}
          {!isRecordingAudio && recordedAudio && (
            <div className="flex gap-1">
              <audio
                src={URL.createObjectURL(recordedAudio)}
                controls
                className="w-full h-[40px]"
              />
              <Button
                variant="destructive"
                onClick={() => {
                  setRecordedAudio(null);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
          {!isRecordingVideo && recordedVideo && (
            <div className="flex gap-1">
              <video src={URL.createObjectURL(recordedVideo)} controls />
              <Button
                variant="destructive"
                onClick={() => {
                  setRecordedVideo(null);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
          {!isRecordingAudio &&
            !recordedAudio &&
            !isRecordingVideo &&
            !recordedVideo && (
              <Editor
                value={message}
                onChange={setMessage}
                onEnter={handleSubmit}
                disabled={isRecordingAudio}
                isPreview={isPreview}
              />
            )}
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
                    isRecordingAudio ||
                    isRecordingVideo ||
                    (message.trim().length === 0 &&
                      !recordedAudio &&
                      !recordedVideo)
                  }
                  {...longPressSendProps}
                >
                  <Send className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Long press to show preview</TooltipContent>
            </Tooltip>
          )}

          {(!attachments || attachments.length === 0) &&
            (isVideo ? (
              <Button
                type="button"
                size="icon"
                variant={isRecordingVideo ? 'destructive' : 'secondary'}
                onClick={
                  isRecordingVideo ? stopRecordingVideo : startRecordingVideo
                }
                {...longPressVoiceProps}
              >
                {isRecordingVideo ? (
                  <Square className="size-4" fill="currentColor" />
                ) : (
                  <Video className="size-4" />
                )}
              </Button>
            ) : (
              <Button
                type="button"
                size="icon"
                variant={isRecordingAudio ? 'destructive' : 'secondary'}
                onClick={
                  isRecordingAudio ? stopRecordingAudio : startRecordingAudio
                }
                {...longPressVoiceProps}
              >
                {isRecordingAudio ? (
                  <Square className="size-4" fill="currentColor" />
                ) : (
                  <Mic className="size-4" />
                )}
              </Button>
            ))}
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
