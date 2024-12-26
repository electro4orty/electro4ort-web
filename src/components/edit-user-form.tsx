import { User } from '@/types/user';
import { useForm } from 'react-hook-form';
import FormField from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { updateUserService } from '@/services/update-user.service';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { format, formatISO } from 'date-fns';
import { Form, FormField as FormController } from '@/components/ui/form';
import AvatarField from './avatar-field';
import { EditUserFormData } from './edit-user-form.config';
import { ResponsiveDialogFooter } from './ui/responsive-dialog';

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
      birthDate: user.birthDate ? new Date(user.birthDate) : undefined,
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
      data: {
        ...data,
        birthDate: data.birthDate ? formatISO(data.birthDate) : '',
      },
    });
  };

  return (
    <Form {...form}>
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
          <FormField label="Avatar" render={() => <AvatarField />} />
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
                          field.value
                            ? format(field.value, 'dd.MM.yyyy')
                            : undefined
                        }
                        readOnly
                      />
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar
                        className="flex justify-center"
                        mode="single"
                        pagedNavigation
                        selected={field.value}
                        onSelect={(date) => {
                          form.setValue('birthDate', date);
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

        <ResponsiveDialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            Save
          </Button>
        </ResponsiveDialogFooter>
      </form>
    </Form>
  );
}
