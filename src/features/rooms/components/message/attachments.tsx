import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Attachment } from '@/types/attachment';
import { getFileUrl } from '@/utils/get-file-url';

interface AttachmentsProps {
  attachments: Attachment[];
}

export default function Attachments({ attachments }: AttachmentsProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {attachments.map((attachment) => (
        <Dialog key={attachment.fileName}>
          <DialogTrigger>
            <img
              src={getFileUrl(attachment.fileName)}
              alt={attachment.fileName}
              className="block max-h-[400px] object-cover object-center overflow-hidden rounded-lg"
            />
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Preview</DialogTitle>
            <DialogDescription className="sr-only">Preview</DialogDescription>
            <img
              src={getFileUrl(attachment.fileName)}
              alt={attachment.fileName}
              className="rounded"
            />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
