import { createBrowserRouter } from 'react-router-dom';
import { RouterPath } from '../constants/router-paths';
import AppLayout from '../layouts/app-layout';
import AuthLayout from '../layouts/auth-layout';
import HubLayout from '../layouts/hub-layout';
import ErrorBoundary from '../components/error-boundary';
import DashboardScreen from '../screens/dashboard-screen';
import RoomScreen from '@/features/rooms/screens/room-screen';
import HubScreen from '@/features/hubs/screens/hub-screen';
import LoginScreen from '@/features/auth/screens/login-screen';
import RegisterScreen from '@/features/auth/screens/register-screen';
import AuthGuard from '@/features/auth/components/auth-guard';
import InviteHubScreen from '@/features/hubs/screens/invite-hub-screen';

export const router = createBrowserRouter(
  [
    {
      element: <AppLayout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          element: <AuthLayout />,
          children: [
            {
              path: RouterPath.LOGIN,
              element: (
                <AuthGuard isPublic>
                  <LoginScreen />
                </AuthGuard>
              ),
            },
            {
              path: RouterPath.REGISTER,
              element: (
                <AuthGuard isPublic>
                  <RegisterScreen />
                </AuthGuard>
              ),
            },
          ],
        },
        {
          element: <HubLayout />,
          children: [
            {
              path: RouterPath.DASHBOARD,
              element: (
                <AuthGuard>
                  <DashboardScreen />
                </AuthGuard>
              ),
            },
            {
              path: RouterPath.HUB,
              element: (
                <AuthGuard>
                  <HubScreen />
                </AuthGuard>
              ),
            },

            {
              path: RouterPath.ROOM,
              element: (
                <AuthGuard>
                  <RoomScreen />
                </AuthGuard>
              ),
            },
          ],
        },
        {
          path: RouterPath.INVITE_HUB,
          element: (
            <AuthGuard>
              <InviteHubScreen />
            </AuthGuard>
          ),
        },
      ],
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
