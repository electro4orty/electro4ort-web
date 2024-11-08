import { getHubPath } from '@/app/constants/router-paths';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { joinHubService } from '@/features/hubs/services/join-hub-service';
import { TriggerDialogProps } from '@/types/dialog-props';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface JoinHubFormData {
  slug: string;
}

export default function JoinHubDialog({ trigger }: TriggerDialogProps) {
  const form = useForm<JoinHubFormData>({
    defaultValues: {
      slug: '',
    },
  });

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: joinHubService,
    onSuccess: (data) => {
      navigate(getHubPath(data.slug));
    },
  });

  const handleSubmit = (data: JoinHubFormData) => {
    mutate(data.slug);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join hub</DialogTitle>
          <DialogDescription>
            Find and join your favorite hubs
          </DialogDescription>
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
      </DialogContent>
    </Dialog>
  );
}
