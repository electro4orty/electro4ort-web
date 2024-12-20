import {
  ResponsiveDialog,
  ResponsiveDialogContent,
} from '@/components/ui/responsive-dialog';
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
    <div className="flex flex-wrap gap-1">
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
            className="block size-40 object-cover object-center overflow-hidden rounded-lg"
          />
        </button>
      ))}
      <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
        <ResponsiveDialogContent>
          <AttachmentPreviewDialog
            attachments={attachments}
            selectedIndex={selectedIndex}
          />
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </div>
  );
}
