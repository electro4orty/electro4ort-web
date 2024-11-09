import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { registerService } from '../services/register.service';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import FormField from '@/components/ui/form-field';

const validationSchema = z
  .object({
    username: z.string().min(1).max(32),
    password: z.string().min(1).max(4),
    displayName: z.string().min(1).max(32),
    repeatPassword: z.string().min(1).max(4),
  })
  .superRefine(({ password, repeatPassword }, ctx) => {
    if (password !== repeatPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['repeatPassword'],
      });
    }
  });

type RegisterFormData = z.infer<typeof validationSchema>;

export default function RegisterScreen() {
  const form = useForm<RegisterFormData>({
    defaultValues: {
      username: '',
      displayName: '',
      password: '',
      repeatPassword: '',
    },
    resolver: zodResolver(validationSchema),
  });

  const { login } = useAuthStore();

  const { mutate, isPending } = useMutation({
    mutationFn: registerService,
    onSuccess: (data) => {
      login(data);
    },
  });

  const handleSubmit = (data: RegisterFormData) => {
    mutate({
      displayName: data.displayName,
      username: data.username,
      password: data.password,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex flex-col gap-3 w-80 mb-4">
        <FormField
          label="Username"
          fieldState={form.getFieldState('username', form.formState)}
          inputProps={{
            type: 'text',
            placeholder: 'Username',
            ...form.register('username'),
          }}
        />
        <FormField
          label="Display name"
          fieldState={form.getFieldState('displayName', form.formState)}
          inputProps={{
            type: 'text',
            placeholder: 'Display name',
            ...form.register('displayName'),
          }}
        />
        <FormField
          label="Password"
          fieldState={form.getFieldState('password', form.formState)}
          inputProps={{
            type: 'password',
            placeholder: 'Password',
            ...form.register('password'),
          }}
        />
        <FormField
          label="Repeat password"
          fieldState={form.getFieldState('repeatPassword', form.formState)}
          inputProps={{
            type: 'password',
            placeholder: 'Repeat password',
            ...form.register('repeatPassword'),
          }}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        Register
      </Button>
    </form>
  );
}
