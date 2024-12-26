import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ImagePlay, Mic, Plus, Upload, Video } from 'lucide-react';

interface AddDropdownProps {
  onUploadClick: () => void;
  onGifClick: () => void;
  onAudioClick: () => void;
  onVideoClick: () => void;
}

export default function AddDropdown({
  onUploadClick,
  onGifClick,
  onAudioClick,
  onVideoClick,
}: AddDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="icon" variant="ghost">
          <Plus className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onUploadClick}>
          <Upload className="size-4 mr-2" />
          Upload attachments
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onGifClick}>
          <ImagePlay className="size-4 mr-2" />
          Send GIFs
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAudioClick}>
          <Mic className="size-4 mr-2" />
          Record audio
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onVideoClick}>
          <Video className="size-4 mr-2" />
          Record video
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
