import { User } from '@/types/user';
import { useForm } from 'react-hook-form';
import FormField from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { useMutation } from '@tanstack/react-query';
import { updateUserService } from '../services/update-user.service';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { FormField as FormController } from '@/components/ui/form';
import { uploadAvatarService } from '../services/upload-avatar.service';
import { getFileUrl } from '@/utils/get-file-url';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface EditUserFormData {
  username: string;
  displayName: string;
  avatar: string;
  birthDate: string;
}

interface EditUserFormProps {
  user: User;
  onCancel: () => void;
  onSaved: () => void;
}

export default function EditUserForm({
  user,
  onCancel,
  onSaved,
}: EditUserFormProps) {
  const form = useForm<EditUserFormData>({
    defaultValues: {
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar ?? '',
      birthDate: user.birthDate ?? '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateUserService,
    onSuccess: () => {
      onSaved();
    },
  });

  const handleSubmit = (data: EditUserFormData) => {
    mutate({
      userId: user.id,
      data,
    });
  };

  const { mutate: uploadAvatarMutate } = useMutation({
    mutationFn: uploadAvatarService,
    onSuccess: (data) => {
      form.setValue('avatar', data.fileName);
    },
  });

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex flex-col gap-2 mb-4">
        <FormField
          label="Username"
          inputProps={{
            placeholder: 'Username',
            ...form.register('username'),
          }}
        />
        <FormField
          label="Display name"
          inputProps={{
            placeholder: 'Display name',
            ...form.register('displayName'),
          }}
        />
        <FormField
          label="Avatar"
          render={() => (
            <FormController
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <div>
                  <Input
                    type="file"
                    placeholder="Avatar"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      uploadAvatarMutate(e.target.files[0])
                    }
                  />
                  {field.value && (
                    <Avatar>
                      <AvatarImage src={getFileUrl(field.value)} />
                    </Avatar>
                  )}
                </div>
              )}
            />
          )}
        />
        <FormField
          label="Birth date"
          render={() => (
            <FormController
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Input
                      type="text"
                      value={
                        typeof field.value === 'string' && field.value
                          ? format(field.value, 'dd.MM.yyyy')
                          : undefined
                      }
                    />
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      className="flex justify-center"
                      mode="single"
                      selected={
                        typeof field.value === 'string'
                          ? new Date(field.value)
                          : new Date()
                      }
                      onSelect={(date) => {
                        form.setValue('birthDate', date?.toString() ?? '');
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          )}
          inputProps={{
            placeholder: 'Birth date',
            ...form.register('birthDate'),
          }}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          Save
        </Button>
      </DialogFooter>
    </form>
  );
}
