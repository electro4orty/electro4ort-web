import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Attachment } from '@/types/attachment';
import { getFileUrl } from '@/utils/get-file-url';

interface AttachmentPreviewDialogProps {
  attachments: Attachment[];
  selectedIndex: number;
}

export default function AttachmentPreviewDialog({
  attachments,
  selectedIndex,
}: AttachmentPreviewDialogProps) {
  return (
    <>
      <DialogTitle>Preview</DialogTitle>
      <DialogDescription className="sr-only">Preview</DialogDescription>
      <Carousel
        opts={{
          startIndex: selectedIndex,
        }}
      >
        <CarouselContent>
          {attachments.map((attachment) => (
            <CarouselItem key={attachment.id}>
              <img
                src={getFileUrl(attachment.fileName)}
                alt={attachment.fileName}
                className="rounded object-contain object-center w-full max-h-[70vh]"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}
