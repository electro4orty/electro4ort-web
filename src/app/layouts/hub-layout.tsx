import { Outlet, useParams } from 'react-router-dom';
import AppSidebar from '../components/app-sidebar';
import { SidebarRoot, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthCheck } from '../hooks/use-auth-check';
import { useEffect } from 'react';
import { socket, WsException } from '@/lib/socket';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth-store';

export default function HubLayout() {
  useAuthCheck();
  const { user } = useAuthStore();

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (user) {
        socket.emit('ping', {
          userId: user.id,
        });
      }
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [user]);

  return (
    <SidebarRoot>
      <AppSidebar />
      <div className="grow h-full">
        <div className="h-full pt-[60px] md:pt-0">
          <Outlet />
        </div>
        <div className="flex items-center gap-2 md:hidden border-b p-2 h-[60px] fixed left-0 top-0 right-0 z-50">
          <SidebarTrigger />

          <button type="button" onClick={() => window.location.reload()}>
            <img src="/logo-wide.png" width="180px" alt="Electro4ort" />
          </button>
        </div>
      </div>
    </SidebarRoot>
  );
}
