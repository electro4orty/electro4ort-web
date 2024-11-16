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
import { createRoomService } from '../services/create-room.service';
import { RoomType } from '@/types/room';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/ui/form';
import { toast } from 'sonner';

const roomTypeOptions = [
  {
    value: RoomType.TEXT,
    id: `roomType${RoomType.TEXT}Radio`,
    label: 'Text',
  },
  {
    value: RoomType.VOICE,
    id: `roomType${RoomType.VOICE}Radio`,
    label: 'Voice',
  },
];

interface CreateRoomFormData {
  name: string;
  type: RoomType;
}

interface CreateRoomProps {
  hubSlug: string;
  onClose: () => void;
}

export default function CreateRoom({ hubSlug, onClose }: CreateRoomProps) {
  const form = useForm<CreateRoomFormData>({
    defaultValues: {
      name: '',
      type: RoomType.TEXT,
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createRoomService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rooms'],
      });
      toast.success('Room created');
      onClose();
    },
  });

  const handleSubmit = (values: CreateRoomFormData) => {
    mutate({
      ...values,
      hubSlug,
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create room</DialogTitle>
        <DialogDescription>Configure new room</DialogDescription>
      </DialogHeader>

      <form
        id="createRoomForm"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            placeholder="Name"
            id="name"
            autoComplete="off"
            {...form.register('name')}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label asChild>
            <span>Type</span>
          </Label>
          <FormField
            control={form.control}
            name="type"
            render={({ field: { onChange, ...field } }) => (
              <RadioGroup
                id="type"
                className="flex"
                {...field}
                onValueChange={onChange}
              >
                {roomTypeOptions.map((option) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <RadioGroupItem id={option.id} value={option.value} />
                    <Label htmlFor={option.id}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>
      </form>

      <DialogFooter>
        <Button type="submit" form="createRoomForm" disabled={isPending}>
          Create
        </Button>
      </DialogFooter>
    </>
  );
}
