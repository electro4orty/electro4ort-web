import { apiClient } from '@/lib/api-client';
import { Room, RoomType } from '@/types/room';

interface CreateRoomDTO {
  name: string;
  type: RoomType;
  hubSlug: string;
}

export async function createRoomService(data: CreateRoomDTO) {
  const res = await apiClient.post<Room>('/rooms', data);
  return res.data;
}
