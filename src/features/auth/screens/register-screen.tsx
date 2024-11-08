import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { registerService } from '../services/register.service';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';

const validationSchema = z.object({
  username: z.string().min(1).max(80),
  displayName: z.string().min(1).max(80),
  password: z.string().min(4).max(255),
  repeatPassword: z.string().min(4).max(255),
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
      <div>
        <Input
          type="text"
          placeholder="Username"
          {...form.register('username')}
        />
      </div>
      <div>
        <Input
          type="text"
          placeholder="Display name"
          {...form.register('displayName')}
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password"
          {...form.register('password')}
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Repeat password"
          {...form.register('repeatPassword')}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        Register
      </Button>
    </form>
  );
}
