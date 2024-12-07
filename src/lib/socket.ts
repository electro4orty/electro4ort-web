import { useAuthStore } from '@/store/auth-store';
import { Message } from '@/types/message';
import { User } from '@/types/user';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

export interface WsException {
  status: string;
  message: string;
}

interface ListenEvents {
  message: (message: Message) => void;
  exception: (exception: WsException) => void;
  userStatusUpdate: (user: User) => void;
}

interface EmitEvents {
  message: (
    data: { roomId: string; userId: string; body: string },
    callback: (message: Message) => void
  ) => void;
  join: (data: { hubSlug: string }) => void;
  leave: (data: { hubSlug: string }) => void;
  ping: (data: { userId: string }) => void;
  subscribeUserStatusUpdate: (data: { userId: string }) => void;
  unsubscribeUserStatusUpdate: (data: { userId: string }) => void;
}

export const socket = io(process.env.VITE_API_URL, {
  auth: (cb) => {
    const token = useAuthStore.getState().token;
    if (token) {
      cb({ token: `Bearer ${token}` });
    }
  },
}) as Socket<ListenEvents, EmitEvents>;

interface RoomsListenEvents {
  typing: (user: User) => void;
  typingStopped: (user: User) => void;
}

interface RoomsEmitEvents {
  type: (data: { userId: string; roomId: string }) => void;
  join: (data: { roomId: string }) => void;
  leave: (data: { roomId: string }) => void;
}

export const roomsSocket = io(`${process.env.VITE_API_URL}/rooms`, {
  auth: (cb) => {
    const token = useAuthStore.getState().token;
    if (token) {
      cb({ token: `Bearer ${token}` });
    }
  },
}) as Socket<RoomsListenEvents, RoomsEmitEvents>;

export function connectAll() {
  if (!socket.connected) {
    socket.connect();
  }

  if (!roomsSocket.connected) {
    roomsSocket.connect();
  }
}

socket.on('connect_error', (err) => {
  toast.error(err.message);
  console.log('socket', err);
});

socket.on('disconnect', (reason) => {
  toast.error(reason);
  console.log('socket', reason);
});

roomsSocket.on('connect_error', (err) => {
  toast.error(err.message);
  console.log('roomsSocket', err);
});

roomsSocket.on('disconnect', (reason) => {
  toast.error(reason);
  console.log('roomsSocket', reason);
});
