import {
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
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
      <ResponsiveDialogHeader>
        <ResponsiveDialogTitle>Preview</ResponsiveDialogTitle>
        <ResponsiveDialogDescription className="sr-only">
          Preview
        </ResponsiveDialogDescription>
      </ResponsiveDialogHeader>
      <Carousel
        opts={{
          startIndex: selectedIndex,
        }}
      >
        <CarouselContent>
          {attachments.map((attachment) => (
            <CarouselItem key={attachment.id} className="flex">
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
