import { User } from '@/types/user';
import { savePushSubscriptionService } from '../services/save-push-subscription.service';

let isRegistering = false;

export async function registerSW(user: User) {
  if (!('serviceWorker' in navigator) || isRegistering) {
    return;
  }

  isRegistering = true;

  const sw = await navigator.serviceWorker.register('/sw.js');
  await sw.update();
  const notifications = await sw.getNotifications();
  notifications.forEach((notification) => notification.close());

  const subscription = await sw.pushManager.subscribe({
    applicationServerKey: process.env.VITE_WEB_PUSH_PUBLIC_KEY,
    userVisibleOnly: true,
  });

  await savePushSubscriptionService({
    userId: user.id,
    data: subscription,
  });
}
