import { Badge } from '@/components/ui/badge';
import { socket } from '@/lib/socket';
import { useState, useEffect } from 'react';

export default function WsStatus() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const handleConnect = () => {
      setIsOnline(socket.connected);
    };

    const timerRef = setInterval(handleConnect, 1000);

    return () => {
      clearInterval(timerRef);
    };
  }, []);

  return (
    <Badge variant={isOnline ? 'success' : 'destructive'}>
      {isOnline ? 'online' : 'offline'}
    </Badge>
  );
}
