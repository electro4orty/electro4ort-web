import { Navigate, useParams } from 'react-router-dom';
import Chat from '../components/chat';
import { useQuery } from '@tanstack/react-query';
import { getRoomService } from '../services/get-room.service';
import { getDashboardPath } from '@/app/constants/router-paths';

export default function RoomScreen() {
  const { roomId } = useParams();

  const { isError } = useQuery({
    queryKey: ['rooms', roomId],
    queryFn: () => (roomId ? getRoomService(roomId) : null),
    enabled: !!roomId,
    retry: false,
  });

  if (!roomId) {
    return null;
  }

  if (isError) {
    return <Navigate to={getDashboardPath()} />;
  }

  return <Chat roomId={roomId} />;
}
