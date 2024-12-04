import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { Edit2, Eye } from 'lucide-react';

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
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    input.style.height = '0px';
    input.style.height = `${input.scrollHeight + 3}px`;
  }, [value, isPreviewVisible]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.shiftKey && e.code === 'Enter') {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div className="flex gap-1 items-end grow">
      {isPreviewVisible ? (
        <div
          className="bg-secondary w-full px-3 py-[7px] border rounded-md markdown max-h-[200px] overflow-y-auto"
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
          className="max-h-[200px] resize-none"
        />
      )}
      <Button
        type="button"
        size="icon"
        variant="secondary"
        onClick={() => setIsPreviewVisible((prev) => !prev)}
        className="shrink-0"
      >
        {isPreviewVisible ? (
          <Edit2 className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </Button>
    </div>
  );
}
