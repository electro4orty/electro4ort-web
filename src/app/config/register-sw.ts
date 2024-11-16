import { User } from '@/types/user';
import { savePushSubscriptionService } from '../services/save-push-subscription.service';

export async function registerSW(user: User) {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const sw = await navigator.serviceWorker.register('/sw.js');
    await sw.update();

    const handleMessage = (e: MessageEvent<{ type: string }>) => {
      if (e.data.type === 'check-user-activity') {
        sw.active?.postMessage({
          type: 'user-activity',
          documentVisibility: document.visibilityState,
        });
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    const subscription = await sw.pushManager.subscribe({
      applicationServerKey: import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY,
      userVisibleOnly: true,
    });

    await savePushSubscriptionService({
      userId: user.id,
      data: subscription,
    });

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  } catch (error) {
    console.log(error);
  }
}
