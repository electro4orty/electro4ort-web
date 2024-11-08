import { useParams } from 'react-router-dom';
import Chat from '../components/chat';

export default function RoomScreen() {
  const { roomId } = useParams();
  if (!roomId) {
    return null;
  }

  return <Chat roomId={roomId} />;
}
