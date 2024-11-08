import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="p-4 flex flex-col gap-2 items-center justify-center">
      <Outlet />
    </div>
  );
}
