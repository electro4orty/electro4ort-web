import { getDashboardPath, getLoginPath } from '@/constants/router-paths';
import { useAuthStore } from '@/store/auth-store';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps extends React.PropsWithChildren {
  isPublic?: boolean;
}

export default function AuthGuard({ children, isPublic }: AuthGuardProps) {
  const { token } = useAuthStore();

  if ((token && !isPublic) || (!token && isPublic)) {
    return children;
  }

  const path = isPublic ? getDashboardPath() : getLoginPath();

  return <Navigate to={path} />;
}
