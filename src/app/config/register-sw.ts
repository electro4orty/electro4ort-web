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

  let isActive = true;

  const handleMessage = (e: MessageEvent<{ type: string }>) => {
    if (e.data.type === 'check-user-activity') {
      sw.active?.postMessage({
        type: 'user-activity',
        isActive: isActive && document.visibilityState === 'visible',
      });
    }
  };

  const handleFocus = () => {
    isActive = true;
  };

  const handleBlur = () => {
    isActive = false;
  };

  navigator.serviceWorker.addEventListener('message', handleMessage);
  window.addEventListener('focus', handleFocus);
  window.addEventListener('blur', handleBlur);

  const subscription = await sw.pushManager.subscribe({
    applicationServerKey: process.env.VITE_WEB_PUSH_PUBLIC_KEY,
    userVisibleOnly: true,
  });

  await savePushSubscriptionService({
    userId: user.id,
    data: subscription,
  });

  return () => {
    navigator.serviceWorker.removeEventListener('message', handleMessage);
    window.removeEventListener('focus', handleFocus);
    window.removeEventListener('blur', handleBlur);
  };
}
