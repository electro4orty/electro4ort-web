import { useFormContext } from 'react-hook-form';
import { FormField } from '@/components/ui/form';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getFileUrl } from '@/utils/get-file-url';
import { useMutation } from '@tanstack/react-query';
import { uploadAvatarService } from '../services/upload-avatar.service';
import { EditUserFormData } from './edit-user-form.config';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AvatarField() {
  const form = useFormContext<EditUserFormData>();

  const { mutate } = useMutation({
    mutationFn: uploadAvatarService,
    onSuccess: (data) => {
      form.setValue('avatar', data.fileName);
    },
  });

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      maxFiles: 1,
      maxSize: 5 * 1000 * 1000,
      accept: {
        'image/*': [],
      },
      onDropAccepted: (files) => {
        const [file] = files;
        mutate(file);
      },
      onDropRejected: (fileRejections) => {
        const errorMessage = fileRejections[0].errors[0].message;
        toast.error(errorMessage);
      },
    });

  return (
    <FormField
      control={form.control}
      name="avatar"
      render={({ field }) => (
        <div className="flex gap-2">
          <div
            {...getRootProps({
              className: cn(
                'flex flex-col justify-center items-center border border-dashed rounded-lg p-4 h-[90px] grow transition-colors',
                isDragActive && 'border-primary'
              ),
            })}
          >
            <input
              {...getInputProps({
                accept: 'image/*',
              })}
            />
            {acceptedFiles.length === 0 ? (
              <p>Drop files here</p>
            ) : (
              <p className="text-sm">{acceptedFiles[0].name}</p>
            )}
          </div>
          {field.value && (
            <Avatar className="shrink-0 size-[90px]">
              <AvatarImage src={getFileUrl(field.value)} />
            </Avatar>
          )}
        </div>
      )}
    />
  );
}
