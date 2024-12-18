import { Recorder } from '@/utils/recorder';
import { useRef, useState } from 'react';
import { uploadAudioService } from '../services/upload-audio.service';
import { CreateMessageDTO } from '../services/create-message.service';
import { MessageType } from '@/types/message';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';

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

  const handleSubmit = () => {
    if (!recordedAudio) {
      return;
    }

    uploadAudioService(recordedAudio).then((res) => {
      sendMessage({
        body: res.fileName,
        text: res.fileName,
        roomId,
        userId,
        attachments: [],
        type: MessageType.AUDIO,
      });
    });
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
      <DialogTitle>Record audio</DialogTitle>
      <DialogDescription className="sr-only">Record audio</DialogDescription>
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
