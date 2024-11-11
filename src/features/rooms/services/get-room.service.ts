import { apiClient } from '@/lib/api-client';
import { Room } from '@/types/room';

export async function getRoomService(roomId: string) {
  const res = await apiClient.get<Room>(`/rooms/${roomId}`);
  return res.data;
}
