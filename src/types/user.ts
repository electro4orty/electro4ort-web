export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

export interface User {
  id: string;
  username: string;
  password: string;
  displayName: string;
  birthDate: string;
  avatar: string | null;
  status: UserStatus;
}
