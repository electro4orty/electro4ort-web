import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getFileUrl } from '@/utils/get-file-url';
import { secondsInMinute } from 'date-fns/constants';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const timeFormat = new Intl.NumberFormat('en', {
  minimumIntegerDigits: 2,
});

interface AudioMessageProps {
  fileName: string;
}

export default function AudioMessage({ fileName }: AudioMessageProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    const handleTimeUpdate = () => {
      if (!audioRef.current) {
        return;
      }

      audioRef.current.currentTime = 0;
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      setDuration(audioRef.current.duration);
    };

    audioRef.current.currentTime = 1e101;
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
  }, []);

  return (
    <div className="w-[250px] flex items-center gap-2">
      <audio
        ref={audioRef}
        src={getFileUrl(fileName)}
        controls
        className="sr-only"
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onPlay={(e) => setIsPaused(e.currentTarget.paused)}
        onPause={(e) => setIsPaused(e.currentTarget.paused)}
      />
      <Button
        type="button"
        size="icon"
        className="rounded-full shrink-0"
        onClick={() =>
          audioRef.current?.paused
            ? audioRef.current.play()
            : audioRef.current?.pause()
        }
      >
        {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
      </Button>
      <div className="grow">
        <Progress
          value={
            audioRef.current ? (time / audioRef.current.duration) * 100 : 0
          }
          className="h-1"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {timeFormat.format(Math.round(time / secondsInMinute))}:
            {timeFormat.format(Math.round(time) % 60)}
          </span>
          <span>
            {timeFormat.format(
              Math.round(
                (duration === Infinity ? 0 : duration) / secondsInMinute
              )
            )}
            :
            {timeFormat.format(
              Math.round(duration === Infinity ? 0 : duration) % 60
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
