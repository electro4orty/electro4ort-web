import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useSettingsStore } from '@/store/settings-store';
import {
  Bold,
  Code,
  CodeSquare,
  Italic,
  Link,
  Strikethrough,
  Underline,
} from 'lucide-react';
import { PopoverAnchor } from '@radix-ui/react-popover';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useDebouncedCallback } from 'use-debounce';

interface EditorProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onEnter: () => void;
  isPreview: boolean;
  onMediaPaste: (files: FileList) => void;
}

export default function Editor({
  value,
  disabled,
  onChange,
  onEnter,
  isPreview,
  onMediaPaste,
}: EditorProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const selectionRef = useRef({
    start: 0,
    end: 0,
  });
  const { isSendMessageUsingModifier } = useSettingsStore();
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);

  const openFormatDropdown = useDebouncedCallback(() => {
    setIsFormatDropdownOpen(true);
  }, 350);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    input.style.height = '0px';
    input.style.height = `${input.scrollHeight + 2}px`;
  }, [value, isPreview]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    openFormatDropdown();

    if (e.code === 'Enter') {
      if (isSendMessageUsingModifier && e.ctrlKey) {
        e.preventDefault();
        onEnter();
      }

      if (!isSendMessageUsingModifier && !e.ctrlKey) {
        e.preventDefault();
        onEnter();
      }

      if (isSendMessageUsingModifier && !e.ctrlKey) {
        return;
      }

      if (!isSendMessageUsingModifier && e.ctrlKey) {
        return;
      }
    }
  };

  const wrapSelectedText = (str: string) => {
    const { start: selectionStart, end: selectionEnd } = selectionRef.current;
    onChange(
      `${value.substring(0, selectionStart)}${str}${value.substring(
        selectionStart,
        selectionEnd
      )}${str}${value.substring(selectionEnd, value.length)}`
    );
  };

  const makeLink = () => {
    const { start: selectionStart, end: selectionEnd } = selectionRef.current;

    const selectedText = value.substring(selectionStart, selectionEnd);

    onChange(
      `${value.substring(
        0,
        selectionStart
      )}[Label](${selectedText})${value.substring(selectionEnd, value.length)}`
    );
  };

  const makeDetails = () => {
    const { start: selectionStart, end: selectionEnd } = selectionRef.current;

    const selectedText = value.substring(selectionStart, selectionEnd);

    onChange(
      `${value.substring(
        0,
        selectionStart
      )}<details>\n<summary>Label</summary>\n${selectedText}\n</details>${value.substring(
        selectionEnd,
        value.length
      )}`
    );
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
        <Popover
          open={isFormatDropdownOpen}
          onOpenChange={setIsFormatDropdownOpen}
          modal={false}
        >
          <PopoverAnchor asChild>
            <Textarea
              ref={inputRef}
              disabled={disabled}
              placeholder="Write a message"
              value={value}
              onChange={(e) => onChange(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              className="max-h-[200px] resize-none py-[7px] text-base md:text-base"
              onPaste={(e) => onMediaPaste(e.clipboardData.files)}
              onSelect={(e) => {
                selectionRef.current = {
                  start: e.currentTarget.selectionStart,
                  end: e.currentTarget.selectionEnd,
                };

                openFormatDropdown();
              }}
            />
          </PopoverAnchor>
          <PopoverContent
            align="start"
            side="top"
            className="p-1 w-min"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div
              className="flex gap-1"
              onClick={() => setIsFormatDropdownOpen(false)}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => wrapSelectedText('**')}
              >
                <Bold />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => wrapSelectedText('*')}
              >
                <Italic />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => wrapSelectedText('~~')}
              >
                <Strikethrough />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => wrapSelectedText('___')}
              >
                <Underline />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => wrapSelectedText('`')}
              >
                <Code />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={makeDetails}
              >
                <CodeSquare />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={makeLink}
              >
                <Link />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
