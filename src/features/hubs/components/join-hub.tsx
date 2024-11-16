import { getHubPath } from '@/app/constants/router-paths';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { joinHubService } from '@/features/hubs/services/join-hub.service';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface JoinHubFormData {
  slug: string;
}

interface JoinHubDialogProps {
  onClose: () => void;
}

export default function JoinHub({ onClose }: JoinHubDialogProps) {
  const form = useForm<JoinHubFormData>({
    defaultValues: {
      slug: '',
    },
  });

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: joinHubService,
    onSuccess: (data) => {
      onClose();
      navigate(getHubPath(data.slug));
    },
  });

  const handleSubmit = (data: JoinHubFormData) => {
    mutate(data.slug);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Join hub</DialogTitle>
        <DialogDescription>Find and join your favorite hubs</DialogDescription>
      </DialogHeader>
      <form id="joinHubForm" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-2 mb-3">
          <Label htmlFor="joinHubSlug">Hub slug</Label>
          <Input
            type="text"
            autoComplete="off"
            placeholder="Hub slug"
            id="joinHubSlug"
            {...form.register('slug')}
          />
        </div>
      </form>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost" disabled={isPending}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" form="joinHubForm" disabled={isPending}>
          Join
        </Button>
      </DialogFooter>
    </>
  );
}
