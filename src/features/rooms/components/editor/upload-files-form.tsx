import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import Editor from './editor';

interface UploadFilesFormProps {
  onSubmit: (data: { files: File[]; text: string }) => void;
  initialFiles: FileList | null;
  isLoading: boolean;
}

export default function UploadFilesForm({
  onSubmit,
  initialFiles,
  isLoading,
}: UploadFilesFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(
    initialFiles ? Array.from(initialFiles) : []
  );
  const [value, setValue] = useState('');

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => index !== i));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 99,
    maxSize: 50 * 1000 * 1000,
    multiple: true,
    accept: {
      'image/*': [],
    },
    disabled: isLoading,
    onDropAccepted: (files) => {
      setUploadedFiles(files);
    },
    onDropRejected: (fileRejections) => {
      const errorMessage = fileRejections[0].errors[0].message;
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      files: uploadedFiles,
      text: value,
    });
  };

  const send = () => {
    onSubmit({
      files: uploadedFiles,
      text: value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <div
          {...getRootProps({
            className: cn(
              'flex flex-col justify-center items-center border border-dashed rounded-lg p-4 h-[90px] grow transition-colors mb-2',
              isDragActive && 'border-primary'
            ),
          })}
        >
          <input {...getInputProps()} />
          <span className="text-muted-foreground">
            Drop files here to upload
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {uploadedFiles.map((file, i) => (
            <div
              key={file.name}
              className="relative basis-1/4 aspect-square rounded-lg overflow-hidden"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="size-full object-cover object-center"
              />
              <Button
                type="button"
                size="icon-sm"
                className="absolute top-2 right-2"
                variant="secondary"
                onClick={() => removeFile(i)}
              >
                <X />
              </Button>
            </div>
          ))}
        </div>
      </div>
      {uploadedFiles.length !== 0 && (
        <div className="space-y-1 mb-3">
          <Label htmlFor="messageInput">Message</Label>
          <Editor
            id="messageInput"
            value={value}
            onChange={setValue}
            onMediaPaste={(files) =>
              setUploadedFiles((prev) => [...prev, ...Array.from(files)])
            }
            isPreview={false}
            onEnter={send}
          />
        </div>
      )}
      <Button type="submit" disabled={uploadedFiles.length === 0 || isLoading}>
        Send
      </Button>
    </form>
  );
}
