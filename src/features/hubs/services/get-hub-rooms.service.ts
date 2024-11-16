import { apiClient } from '@/lib/api-client';
import { Room } from '@/types/room';

export async function getHubRoomsService(hubSlug: string) {
  const res = await apiClient.get<Room[]>(`/hubs/${hubSlug}/rooms`);
  return res.data;
}
