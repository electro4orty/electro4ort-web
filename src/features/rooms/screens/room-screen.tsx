import { Navigate, useParams } from 'react-router-dom';
import Chat from '../components/chat';
import { useQuery } from '@tanstack/react-query';
import { getRoomService } from '../services/get-room.service';
import { getDashboardPath } from '@/constants/router-paths';
import { useEffect, useRef } from 'react';
import { socket } from '@/lib/socket';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useSettingsStore } from '@/store/settings-store';
import { Dot } from 'lucide-react';

export default function RoomScreen() {
  const { roomId, hubSlug } = useParams();
  const prevRoomId = useRef<string | null>(null);
  const { isMobile, setOpenMobile } = useSidebar();
  const { setLastVisited } = useSettingsStore();

  const { data: room, isError } = useQuery({
    queryKey: ['rooms', roomId],
    queryFn: () => (roomId ? getRoomService(roomId) : null),
    enabled: !!roomId,
    retry: false,
  });

  useEffect(() => {
    if (roomId) {
      if (prevRoomId.current && roomId !== prevRoomId.current) {
        socket.emit('roomLeave', {
          roomId: prevRoomId.current,
        });
      }
      socket.emit('roomJoin', {
        roomId,
      });

      prevRoomId.current = roomId;
    }

    const handleConnect = () => {
      if (roomId) {
        socket.emit('roomJoin', {
          roomId,
        });
        prevRoomId.current = roomId;
      }
    };

    socket.on('connect', handleConnect);

    return () => {
      socket.off('connect', handleConnect);
    };
  }, [roomId]);

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [roomId, setOpenMobile, isMobile]);

  useEffect(() => {
    if (roomId && hubSlug) {
      setLastVisited({
        roomId,
        hubSlug,
      });
    }
  }, [roomId, hubSlug, setLastVisited]);

  if (!roomId) {
    return null;
  }

  if (isError) {
    return <Navigate to={getDashboardPath()} />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="h-16 bg-secondary flex items-center gap-1 px-4">
        <SidebarTrigger className="md:hidden" />
        <button type="button" onClick={() => window.location.reload()}>
          <img src="/logo-wide.png" width="180px" alt="Electro4ort" />
        </button>
        <Dot />
        <span className="text-lg font-bold">{room?.name}</span>
      </div>
      <div className="h-[calc(100%-4rem)] overflow-hidden">
        <Chat roomId={roomId} />
      </div>
    </div>
  );
}
