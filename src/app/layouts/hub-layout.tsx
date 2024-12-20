import { Outlet, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSwipeable } from 'react-swipeable';
import AppSidebar from '../components/app-sidebar';
import { useAuthCheck } from '../hooks/use-auth-check';
import {
  SidebarRoot,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { socket, WsException } from '@/lib/socket';
import { useAuthStore } from '@/store/auth-store';

export default function HubLayout() {
  useAuthCheck();
  const { user } = useAuthStore();
  const { hubSlug } = useParams();
  const { isMobile, setOpenMobile } = useSidebar();

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      if (isMobile) {
        setOpenMobile(true);
      }
    },
  });

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
    <SidebarRoot {...swipeHandlers}>
      <AppSidebar />
      <div className="grow h-full max-w-full">
        <div className="h-full pt-[60px] md:pt-0">
          <Outlet />
        </div>
        <div className="flex items-center gap-2 md:hidden border-b p-2 h-[60px] fixed left-0 top-0 right-0 z-50 bg-black">
          <SidebarTrigger />
          <button type="button" onClick={() => window.location.reload()}>
            <img src="/logo-wide.png" width="180px" alt="Electro4ort" />
          </button>
        </div>
      </div>
    </SidebarRoot>
  );
}
