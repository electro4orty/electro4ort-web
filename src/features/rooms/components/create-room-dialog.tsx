import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { createRoomService } from '../services/create-room.service';
import { RoomType } from '@/types/room';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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

interface CreateRoomDialogProps {
  trigger: React.ReactNode;
  hubSlug: string;
}

export default function CreateRoomDialog({
  trigger,
  hubSlug,
}: CreateRoomDialogProps) {
  const form = useForm<CreateRoomFormData>({
    defaultValues: {
      name: '',
      type: RoomType.TEXT,
    },
  });

  const { mutate } = useMutation({
    mutationFn: createRoomService,
  });

  const handleSubmit = (values: CreateRoomFormData) => {
    mutate({
      ...values,
      hubSlug,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
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
            <RadioGroup id="type" name="type" className="flex">
              {roomTypeOptions.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <RadioGroupItem id={option.id} value={option.value} />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </form>

        <DialogFooter>
          <Button type="submit" form="createRoomForm">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
