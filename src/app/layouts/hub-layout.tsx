import { Outlet, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSwipeable } from 'react-swipeable';
import AppSidebar from '../components/app-sidebar';
import { useAuthCheck } from '../hooks/use-auth-check';
import { SidebarRoot, useSidebar } from '@/components/ui/sidebar';
import { socket, WsException } from '@/lib/socket';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';

export default function HubLayout() {
  useAuthCheck();
  const { user } = useAuthStore();
  const { hubSlug } = useParams();
  const { isMobile, setOpenMobile } = useSidebar();
  const { useSidebarSwipe } = useSettingsStore();

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      if (isMobile && useSidebarSwipe) {
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

    const handleConnect = () => {
      if (!hubSlug) {
        return;
      }

      socket.emit('join', {
        hubSlug,
      });
    };

    socket.on('connect', handleConnect);

    return () => {
      socket.off('connect', handleConnect);
    };
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
        <Outlet />
      </div>
    </SidebarRoot>
  );
}
