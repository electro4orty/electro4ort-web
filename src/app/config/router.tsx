/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RouterPath } from '../constants/router-paths';

const AppLayout = lazy(() => import('../layouts/app-layout'));
const AuthLayout = lazy(() => import('../layouts/auth-layout'));
const HubLayout = lazy(() => import('../layouts/hub-layout'));
const ErrorBoundary = lazy(() => import('../components/error-boundary'));
const DashboardScreen = lazy(() => import('../screens/dashboard-screen'));
const RoomScreen = lazy(() => import('@/features/rooms/screens/room-screen'));
const HubScreen = lazy(() => import('@/features/hubs/screens/hub-screen'));
const LoginScreen = lazy(() => import('@/features/auth/screens/login-screen'));
const RegisterScreen = lazy(
  () => import('@/features/auth/screens/register-screen')
);
const AuthGuard = lazy(() => import('@/features/auth/components/auth-guard'));
const InviteHubScreen = lazy(
  () => import('@/features/hubs/screens/invite-hub-screen')
);

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
