import { Outlet, useParams } from 'react-router-dom';
import AppSidebar from '../components/app-sidebar';
import { SidebarRoot, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthCheck } from '@/features/auth/hooks/use-auth-check';
import { useEffect } from 'react';
import { socket, WsException } from '@/lib/socket';
import { toast } from 'sonner';

export default function HubLayout() {
  useAuthCheck();

  const { hubSlug } = useParams();

  useEffect(() => {
    if (!hubSlug) {
      return;
    }

    socket.emit('join', {
      hubSlug,
    });
  }, [hubSlug]);

  useEffect(() => {
    const handleException = (exception: WsException) => {
      toast.error(exception.message);
    };

    socket.on('exception', handleException);

    return () => {
      socket.off('exception', handleException);
    };
  }, []);

  return (
    <SidebarRoot>
      <AppSidebar />
      <div className="grow h-full">
        <div className="block md:hidden bg-secondary px-2 py-1.5 fixed left-0 right-0">
          <SidebarTrigger />
        </div>
        <div className="h-full pt-[44px] md:pt-0">
          <Outlet />
        </div>
      </div>
    </SidebarRoot>
  );
}
