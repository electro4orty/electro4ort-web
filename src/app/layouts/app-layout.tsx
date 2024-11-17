import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <Suspense fallback={null}>
      <Outlet />
    </Suspense>
  );
}
