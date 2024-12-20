import { Button } from '@/components/ui/button';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { createHubService } from '../services/create-hub.service';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { getHubPath } from '@/constants/router-paths';

interface CreateHubFormData {
  name: string;
}

interface CreateHubProps {
  onClose: () => void;
}

export default function CreateHub({ onClose }: CreateHubProps) {
  const form = useForm<CreateHubFormData>({
    defaultValues: {
      name: '',
    },
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createHubService,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['rooms'],
      });
      queryClient.invalidateQueries({
        queryKey: ['hubs'],
      });
      navigate(getHubPath(data.slug));
      onClose();
    },
  });

  const handleSubmit = (values: CreateHubFormData) => {
    mutate(values);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create hub</DialogTitle>
        <DialogDescription>Configure new hub</DialogDescription>
      </DialogHeader>

      <form
        id="createHubForm"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <Label htmlFor="createHubName">Name</Label>
          <Input
            type="text"
            placeholder="Name"
            id="createHubName"
            autoComplete="off"
            {...form.register('name')}
          />
        </div>
      </form>

      <DialogFooter>
        <Button type="submit" form="createHubForm" disabled={isPending}>
          Create
        </Button>
      </DialogFooter>
    </>
  );
}
