import { savePushSubscriptionService } from '../services/save-push-subscription.service';

export async function registerSW(userId: string) {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const sw = await navigator.serviceWorker.register('/sw.js');
    await sw.update();
    const subscription = await sw.pushManager.subscribe({
      applicationServerKey: import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY,
      userVisibleOnly: true,
    });

    await savePushSubscriptionService({
      userId: userId,
      data: subscription,
    });
  } catch (error) {
    console.log(error);
  }
}
