import { Badge } from '@/components/ui/badge';
import { useSettingsStore } from '@/store/settings-store';

export default function ShortcutsHelper() {
  const { isSendMessageUsingModifier } = useSettingsStore();

  if (isSendMessageUsingModifier) {
    return (
      <div className="text-sm hidden md:block">
        <Badge variant="secondary" className="rounded-xl px-1 py-0.5">
          Ctrl + Enter
        </Badge>{' '}
        - Send message,{' '}
        <Badge variant="secondary" className="rounded-xl px-1 py-0.5">
          Enter
        </Badge>{' '}
        - New line
      </div>
    );
  }

  return (
    <div className="text-sm hidden md:block">
      <Badge variant="secondary" className="rounded-xl px-1 py-0.5">
        Enter
      </Badge>{' '}
      - Send,{' '}
      <Badge variant="secondary" className="rounded-xl px-1 py-0.5">
        Ctrl + Enter
      </Badge>{' '}
      - New line
    </div>
  );
}
