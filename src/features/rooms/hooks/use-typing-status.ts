import { socket } from '@/lib/socket';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export function useTypingStatus() {
  const [typingUsers, setTypingUsers] = useState<User[]>([]);
  const [debouncedTypingUsers] = useDebounce(typingUsers, 100);

  useEffect(() => {
    const handleTyping = (user: User) => {
      setTypingUsers((prev) =>
        prev.some((item) => item.id === user.id) ? prev : [...prev, user]
      );
    };

    const handleTypingStopped = (user: User) => {
      setTypingUsers((prev) => prev.filter((item) => item.id !== user.id));
    };

    socket.on('typing', handleTyping);
    socket.on('typingStopped', handleTypingStopped);

    return () => {
      socket.off('typing', handleTyping);
      socket.off('typingStopped', handleTypingStopped);
    };
  }, []);

  return debouncedTypingUsers;
}
