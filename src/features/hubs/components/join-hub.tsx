import { getHubPath } from '@/constants/router-paths';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { joinHubService } from '@/features/hubs/services/join-hub.service';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveDialogClose,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';

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
      <ResponsiveDialogHeader>
        <ResponsiveDialogTitle>Join hub</ResponsiveDialogTitle>
        <ResponsiveDialogDescription>
          Find and join your favorite hubs
        </ResponsiveDialogDescription>
      </ResponsiveDialogHeader>
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

      <ResponsiveDialogFooter>
        <ResponsiveDialogClose asChild>
          <Button variant="ghost" disabled={isPending}>
            Cancel
          </Button>
        </ResponsiveDialogClose>
        <Button type="submit" form="joinHubForm" disabled={isPending}>
          Join
        </Button>
      </ResponsiveDialogFooter>
    </>
  );
}
