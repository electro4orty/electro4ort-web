import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { loginService } from '../services/login.service';
import FormField from '@/components/ui/form-field';
import { Link } from 'react-router-dom';
import { getRegisterPath } from '@/app/constants/router-paths';

const validationSchema = z.object({
  username: z.string().min(1).max(32),
  password: z.string().min(1).max(4),
});

type LoginFormData = z.infer<typeof validationSchema>;

export default function LoginScreen() {
  const form = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(validationSchema),
  });

  const { login } = useAuthStore();

  const { mutate, isPending } = useMutation({
    mutationFn: loginService,
    onSuccess: (data) => {
      login(data);
    },
  });

  const handleSubmit = (data: LoginFormData) => {
    mutate({
      username: data.username,
      password: data.password,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <h1 className="text-3xl font-semibold mb-4 text-center">Login</h1>
      <div className="flex flex-col gap-3 w-80 mb-4">
        <FormField
          label="Username"
          inputProps={{
            type: 'text',
            placeholder: 'Username',
            id: 'loginUsername',
            ...form.register('username'),
          }}
        />
        <FormField
          label="Password"
          inputProps={{
            type: 'password',
            placeholder: 'Password',
            id: 'loginPassword',
            ...form.register('password'),
          }}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        Login
      </Button>
      <Button asChild variant="link">
        <Link to={getRegisterPath()}>Register</Link>
      </Button>
    </form>
  );
}
