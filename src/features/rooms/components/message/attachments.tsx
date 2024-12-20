import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Attachment } from '@/types/attachment';
import { getFileUrl } from '@/utils/get-file-url';
import AttachmentPreviewDialog from './attachment-preview-dialog';
import { useState } from 'react';

interface AttachmentsProps {
  attachments: Attachment[];
}

export default function Attachments({ attachments }: AttachmentsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] xl:grid-cols-[repeat(auto-fit,minmax(120px,0.75fr))] gap-1">
      {attachments.map((attachment, i) => (
        <button
          key={attachment.fileName}
          type="button"
          onClick={() => {
            setSelectedIndex(i);
            setIsOpen(true);
          }}
        >
          <img
            src={getFileUrl(attachment.fileName)}
            alt={attachment.fileName}
            className="block size-full object-cover object-center overflow-hidden rounded-lg"
          />
        </button>
      ))}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <AttachmentPreviewDialog
            attachments={attachments}
            selectedIndex={selectedIndex}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
