import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSettingsStore } from '@/store/settings-store';
import Version from './version';
import { Checkbox } from '@/components/ui/checkbox';

export default function Settings() {
  const {
    isSendMessageUsingModifier,
    setIsSendMessageUsingModifier,
    theme,
    setTheme,
    useMobileDialog,
    setUseMobileDialog,
    useSidebarSwipe,
    setUseSidebarSwipe,
  } = useSettingsStore();

  return (
    <div className="space-y-3">
      <RadioGroup
        value={isSendMessageUsingModifier ? 'option-2' : 'option-1'}
        onValueChange={(value) =>
          setIsSendMessageUsingModifier(value === 'option-2')
        }
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option-1" />
          <Label>
            <kbd className="text-sm bg-secondary px-1 py-0.5 rounded">
              Enter
            </kbd>{' '}
            - Send message{' '}
            <kbd className="text-sm bg-secondary px-1 py-0.5 rounded">
              Ctrl + Enter
            </kbd>{' '}
            - New line
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option-2" />
          <Label>
            <kbd className="text-sm bg-secondary px-1 py-0.5 rounded">
              Ctrl + Enter
            </kbd>{' '}
            - Send message,{' '}
            <kbd className="text-sm bg-secondary px-1 py-0.5 rounded">
              Enter
            </kbd>{' '}
            - New line
          </Label>
        </div>
      </RadioGroup>

      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="red">Red</SelectItem>
          <SelectItem value="rose">Rose</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="green">Green</SelectItem>
          <SelectItem value="blue">Blue</SelectItem>
          <SelectItem value="yellow">Yellow</SelectItem>
          <SelectItem value="violet">Violet</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={useMobileDialog}
          onCheckedChange={setUseMobileDialog}
          id="useMobileDialogInput"
        />
        <Label htmlFor="useMobileDialogInput">Use mobile dialog</Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={useSidebarSwipe}
          onCheckedChange={setUseSidebarSwipe}
          id="useSidebarSwipe"
        />
        <Label htmlFor="useSidebarSwipe">Use swipe to open sidebar</Label>
      </div>

      <div className="text-right">
        <Version />
      </div>
    </div>
  );
}
