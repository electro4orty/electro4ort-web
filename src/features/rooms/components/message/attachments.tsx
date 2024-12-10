import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Attachment } from '@/types/attachment';
import { getFileUrl } from '@/utils/get-file-url';
import AttachmentPreviewDialog from './attachment-preview-dialog';
import { useState } from 'react';

interface AttachmentsProps {
  attachments: Attachment[];
}

export default function Attachments({ attachments }: AttachmentsProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-wrap gap-1">
      {attachments.map((attachment, i) => (
        <button
          key={attachment.fileName}
          type="button"
          onClick={() => setSelectedIndex(i)}
        >
          <img
            src={getFileUrl(attachment.fileName)}
            alt={attachment.fileName}
            className="block size-40 object-cover object-center overflow-hidden rounded-lg"
          />
        </button>
      ))}
      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(value) => setSelectedIndex(value ? 0 : null)}
      >
        <DialogContent>
          {selectedIndex !== null && (
            <AttachmentPreviewDialog
              attachments={attachments}
              selectedIndex={selectedIndex}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
