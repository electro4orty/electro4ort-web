import { Recorder } from '@/utils/recorder';
import { useRef, useState } from 'react';
import { uploadAudioService } from '../../services/upload-audio.service';
import { CreateMessageDTO } from '../../services/create-message.service';
import { MessageType } from '@/types/message';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDialogDescription,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { useMutation } from '@tanstack/react-query';

interface AudioRecorderProps {
  roomId: string;
  userId: string;
  sendMessage: (data: CreateMessageDTO) => void;
  isSending: boolean;
}

export default function AudioRecorder({
  sendMessage,
  roomId,
  userId,
  isSending,
}: AudioRecorderProps) {
  const audioRecorderRef = useRef(
    new Recorder({
      audio: true,
    })
  );
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const { mutate } = useMutation({
    mutationFn: uploadAudioService,
    onSuccess: (data) => {
      sendMessage({
        body: data.fileName,
        text: 'Audio',
        roomId,
        userId,
        attachments: [],
        type: MessageType.AUDIO,
      });
    },
  });

  const handleSubmit = () => {
    if (!recordedAudio) {
      return;
    }

    mutate(recordedAudio);
    setRecordedAudio(null);
  };

  const startRecordingAudio = async () => {
    await audioRecorderRef.current.start();
    setRecordedAudio(null);
    setIsRecording(true);
  };

  const stopRecordingAudio = async () => {
    setIsRecording(false);

    const file = await audioRecorderRef.current.stop();
    setRecordedAudio(file);
  };

  return (
    <>
      <ResponsiveDialogTitle>Record audio</ResponsiveDialogTitle>
      <ResponsiveDialogDescription className="sr-only">
        Record audio
      </ResponsiveDialogDescription>
      <div className="flex items-center gap-2">
        <audio
          src={recordedAudio ? URL.createObjectURL(recordedAudio) : undefined}
          controls
        />
        <Button
          type="button"
          onClick={isRecording ? stopRecordingAudio : startRecordingAudio}
        >
          {isRecording ? 'Stop' : 'Start'}
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={isSending}>
          Send
        </Button>
      </div>
    </>
  );
}
