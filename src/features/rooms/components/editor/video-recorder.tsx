import { Recorder } from '@/utils/recorder';
import { useRef, useState } from 'react';
import { CreateMessageDTO } from '../../services/create-message.service';
import { MessageType } from '@/types/message';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDialogDescription,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { uploadVideoService } from '../../services/upload-video.service';
import { useMutation } from '@tanstack/react-query';

interface VideoRecorderProps {
  roomId: string;
  userId: string;
  sendMessage: (data: CreateMessageDTO) => void;
  isSending: boolean;
}

export default function VideoRecorder({
  sendMessage,
  roomId,
  userId,
  isSending,
}: VideoRecorderProps) {
  const videoRecorderRef = useRef(
    new Recorder({
      audio: true,
      video: true,
    })
  );
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { mutate } = useMutation({
    mutationFn: uploadVideoService,
    onSuccess: (data) => {
      sendMessage({
        body: data.fileName,
        text: 'Video',
        roomId,
        userId,
        attachments: null,
        type: MessageType.VIDEO,
        replyToId: null,
      });
    },
  });

  const handleSubmit = () => {
    if (!recordedVideo) {
      return;
    }

    mutate(recordedVideo);
    setRecordedVideo(null);
  };

  const startRecordingVideo = async () => {
    await videoRecorderRef.current.start();
    setRecordedVideo(null);
    setIsRecording(true);
  };

  const stopRecordingVideo = async () => {
    setIsRecording(false);

    const file = await videoRecorderRef.current.stop();
    setRecordedVideo(file);
  };

  return (
    <>
      <ResponsiveDialogTitle>Record video</ResponsiveDialogTitle>
      <ResponsiveDialogDescription className="sr-only">
        Record video
      </ResponsiveDialogDescription>
      <div className="flex flex-col items-center gap-2">
        <video
          src={recordedVideo ? URL.createObjectURL(recordedVideo) : undefined}
          controls
        />
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={isRecording ? stopRecordingVideo : startRecordingVideo}
          >
            {isRecording ? 'Stop' : 'Start'}
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSending}>
            Send
          </Button>
        </div>
      </div>
    </>
  );
}
