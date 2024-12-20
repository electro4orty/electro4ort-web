import { X } from 'lucide-react';
import { AttachmentDTO } from '../services/create-message.service';

interface AttachmentsPreviewProps {
  attachments: AttachmentDTO[];
  onRemove: (attachment: AttachmentDTO) => void;
}

export default function AttachmentsPreview({
  attachments,
  onRemove,
}: AttachmentsPreviewProps) {
  return (
    <div className="flex flex-wrap gap-1 mb-2">
      {attachments.map((attachment) => (
        <div key={attachment.fileName} className="relative group">
          <img
            src={`${process.env.VITE_API_URL}/api/attachments/${attachment.fileName}`}
            className="block size-[80px] object-cover object-center overflow-hidden rounded-lg"
          />
          <button
            type="button"
            className="absolute inset-0 hidden group-hover:flex justify-center items-center bg-black/50"
            onClick={() => onRemove(attachment)}
          >
            <X />
          </button>
        </div>
      ))}
    </div>
  );
}
