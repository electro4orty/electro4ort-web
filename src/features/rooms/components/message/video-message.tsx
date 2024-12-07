import { getFileUrl } from '@/utils/get-file-url';
import { useRef } from 'react';

interface AudioMessageProps {
  fileName: string;
}

export default function VideoMessage({ fileName }: AudioMessageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="flex items-center gap-2">
      <video
        ref={videoRef}
        src={getFileUrl(fileName)}
        className="rounded-full size-[200px] block object-cover object-center"
        onClick={() =>
          videoRef.current?.paused
            ? videoRef.current.play()
            : videoRef.current?.pause()
        }
      />
    </div>
  );
}
