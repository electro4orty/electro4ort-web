import { getDashboardPath, getLoginPath } from '@/app/constants/router-paths';
import { useAuthStore } from '@/store/auth-store';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  isPublic?: boolean;
}

export default function AuthGuard({
  children,
  isPublic,
}: React.PropsWithChildren<AuthGuardProps>) {
  const { token } = useAuthStore();

  if ((token && !isPublic) || (!token && isPublic)) {
    return children;
  }

  const path = isPublic ? getDashboardPath() : getLoginPath();

  return <Navigate to={path} />;
}
