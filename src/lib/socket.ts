import { useAuthStore } from '@/store/auth-store';
import { Message } from '@/types/message';
import { io, Socket } from 'socket.io-client';

interface ListenEvents {
  message: (message: Message) => void;
}

interface EmitEvents {
  message: (
    data: { roomId: string; userId: string; body: string },
    callback: (message: Message) => void
  ) => void;
  join: (data: { hubSlug: string }) => void;
  leave: (data: { hubSlug: string }) => void;
}

export const socket = io(import.meta.env.VITE_API_URL, {
  auth: (cb) => {
    const token = useAuthStore.getState().token;
    if (token) {
      cb({ token: `Bearer ${token}` });
    }
  },
}) as Socket<ListenEvents, EmitEvents>;
