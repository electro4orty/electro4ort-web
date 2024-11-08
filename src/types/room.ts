export enum RoomType {
  TEXT = 'text',
  VOICE = 'voice',
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  hubId: string;
}
