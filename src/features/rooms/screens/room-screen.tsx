import { Navigate, useParams } from 'react-router-dom';
import Chat from '../components/chat';
import { useQuery } from '@tanstack/react-query';
import { getRoomService } from '../services/get-room.service';
import { getDashboardPath } from '@/constants/router-paths';
import { useEffect, useRef } from 'react';
import { roomsSocket } from '@/lib/socket';
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
    if (roomId && prevRoomId.current && roomId !== prevRoomId.current) {
      roomsSocket.emit('leave', {
        roomId: prevRoomId.current,
      });
    }

    if (roomId) {
      roomsSocket.emit('join', {
        roomId,
      });
    }

    return () => {
      if (roomId) {
        prevRoomId.current = roomId;
      }
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
