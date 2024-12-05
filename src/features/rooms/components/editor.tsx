import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface EditorProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onEnter: () => void;
  isPreview: boolean;
}

export default function Editor({
  value,
  disabled,
  onChange,
  onEnter,
  isPreview,
}: EditorProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    input.style.height = '0px';
    input.style.height = `${input.scrollHeight + 2}px`;
  }, [value, isPreview]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.shiftKey && e.code === 'Enter') {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div className="h-full">
      {isPreview ? (
        <div
          className="bg-secondary w-full h-full px-3 py-[7px] border rounded-md markdown max-h-[200px] overflow-y-auto"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              marked.parse(value, {
                async: false,
              }),
              {
                ADD_ATTR: ['target'],
              }
            ),
          }}
        />
      ) : (
        <Textarea
          ref={inputRef}
          disabled={disabled}
          placeholder="Write a message"
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          className="max-h-[200px] resize-none py-[7px] text-base md:text-base"
        />
      )}
    </div>
  );
}
