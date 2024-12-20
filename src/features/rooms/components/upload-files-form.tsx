import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UploadFilesFormProps {
  onSubmit: (files: FileList) => void;
}

export default function UploadFilesForm({ onSubmit }: UploadFilesFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputElem = e.currentTarget.elements.namedItem(
      'files'
    ) as HTMLInputElement;
    const { files } = inputElem;
    if (files) {
      onSubmit(files);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <Input type="file" name="files" accept="image/*" multiple />
        <p className="text-muted-foreground text-sm mt-1">Max: 5mb</p>
      </div>
      <Button type="submit">Upload</Button>
    </form>
  );
}
