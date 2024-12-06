import { getFileUrl } from '@/utils/get-file-url';
import { useRef } from 'react';

interface AudioMessageProps {
  fileName: string;
}

export default function VideoMessage({ fileName }: AudioMessageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="w-[250px] flex items-center gap-2">
      <video ref={videoRef} src={getFileUrl(fileName)} controls />
    </div>
  );
}
