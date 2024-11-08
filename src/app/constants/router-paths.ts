import { generatePath } from 'react-router-dom';

export enum RouterPath {
  LOGIN = '/auth/login',
  REGISTER = '/auth/register',
  DASHBOARD = '/',
  HUB = '/:hubSlug',
  ROOM = '/:hubSlug/rooms/:roomId',
}

export const getLoginPath = () => RouterPath.LOGIN;
export const getRegisterPath = () => RouterPath.REGISTER;
export const getDashboardPath = () => RouterPath.DASHBOARD;
export const getHubPath = (hubSlug: string) =>
  generatePath(RouterPath.HUB, {
    hubSlug,
  });
export const getRoomPath = (hubSlug: string, roomId: string) =>
  generatePath(RouterPath.ROOM, {
    hubSlug,
    roomId,
  });
