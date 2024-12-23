import { Navigate, useParams } from 'react-router-dom';
import Chat from '../components/chat';
import { useQuery } from '@tanstack/react-query';
import { getRoomService } from '../services/get-room.service';
import { getDashboardPath } from '@/constants/router-paths';
import { useEffect, useRef } from 'react';
import { socket } from '@/lib/socket';
import { useSidebar } from '@/components/ui/sidebar';

export default function RoomScreen() {
  const { roomId } = useParams();
  const prevRoomId = useRef<string | null>(null);
  const { isMobile, setOpenMobile } = useSidebar();

  const { isError } = useQuery({
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

  if (!roomId) {
    return null;
  }

  if (isError) {
    return <Navigate to={getDashboardPath()} />;
  }

  return <Chat roomId={roomId} />;
}
