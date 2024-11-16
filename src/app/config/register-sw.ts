import { User } from '@/types/user';
import { savePushSubscriptionService } from '../services/save-push-subscription.service';

function isIOS() {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
      // eslint-disable-next-line @typescript-eslint/no-deprecated
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
}

export async function registerSW(user: User) {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const sw = await navigator.serviceWorker.register('/sw.js');
    await sw.update();

    let isActive = true;

    const handleMessage = (e: MessageEvent<{ type: string }>) => {
      if (e.data.type === 'check-user-activity') {
        if (isIOS()) {
          sw.active?.postMessage({
            type: 'user-activity',
            isActive,
          });
        } else {
          sw.active?.postMessage({
            type: 'user-activity',
            isActive: document.visibilityState === 'visible',
          });
        }
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
      applicationServerKey: import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY,
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
  } catch (error) {
    console.log(error);
  }
}
