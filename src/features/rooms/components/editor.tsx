import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef } from 'react';

interface EditorProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onEnter: () => void;
}

export default function Editor({
  value,
  disabled,
  onChange,
  onEnter,
}: EditorProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    input.style.height = '0px';
    input.style.height = `${input.scrollHeight + 2}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.shiftKey && e.code === 'Enter') {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div>
      <Textarea
        ref={inputRef}
        disabled={disabled}
        placeholder="Write a message"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        className="max-h-[200px] resize-none"
      />
    </div>
  );
}
