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
  Smile,
  Strikethrough,
} from 'lucide-react';
import { PopoverAnchor } from '@radix-ui/react-popover';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useDebouncedCallback } from 'use-debounce';
import { useIsMobile } from '@/hooks/use-mobile';
import EmojiPicker from './emoji-picker';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
  isPreview: boolean;
  onMediaPaste: (files: FileList) => void;
  id?: string;
}

export default function Editor({
  value,
  onChange,
  onEnter,
  isPreview,
  onMediaPaste,
  id,
}: EditorProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const selectionRef = useRef({
    start: 0,
    end: 0,
  });
  const { isSendMessageUsingModifier } = useSettingsStore();
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const isMobile = useIsMobile();
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const openFormatDropdown = useDebouncedCallback(() => {
    setIsFormatDropdownOpen(true);
  }, 350);

  const closeFormatDropdown = useDebouncedCallback(() => {
    setIsFormatDropdownOpen(false);
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
    closeFormatDropdown();

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

  const insertAfter = (str: string) => {
    const { end: selectionEnd } = selectionRef.current;
    onChange(
      `${value.substring(0, selectionEnd)}${str}${value.substring(
        selectionEnd,
        value.length
      )}`
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

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    selectionRef.current = {
      start: e.currentTarget.selectionStart,
      end: e.currentTarget.selectionEnd,
    };

    if (e.currentTarget.selectionStart !== e.currentTarget.selectionEnd) {
      openFormatDropdown();
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
        <Popover
          open={isFormatDropdownOpen && !isMobile}
          onOpenChange={setIsFormatDropdownOpen}
          modal={false}
        >
          <PopoverAnchor asChild>
            <div className="relative">
              <Textarea
                id={id}
                ref={inputRef}
                placeholder="Write a message"
                value={value}
                onChange={(e) => onChange(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                className="max-h-[200px] resize-none py-[7px] pr-9 text-base md:text-base"
                onPaste={(e) =>
                  e.clipboardData.files.length !== 0 &&
                  onMediaPaste(e.clipboardData.files)
                }
                onSelect={handleSelect}
              />
              <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    <Smile />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto max-w-[100vw]">
                  <EmojiPicker
                    onPick={(emoji) => {
                      insertAfter(emoji);
                      setIsEmojiOpen(false);
                      inputRef.current?.focus();
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
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
                onMouseDown={(e) => {
                  e.preventDefault();
                  wrapSelectedText('**');
                }}
              >
                <Bold />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onMouseDown={(e) => {
                  e.preventDefault();
                  wrapSelectedText('*');
                }}
              >
                <Italic />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onMouseDown={(e) => {
                  e.preventDefault();
                  wrapSelectedText('~~');
                }}
              >
                <Strikethrough />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onMouseDown={(e) => {
                  e.preventDefault();
                  wrapSelectedText('`');
                }}
              >
                <Code />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onMouseDown={(e) => {
                  e.preventDefault();
                  makeDetails();
                }}
              >
                <CodeSquare />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onMouseDown={(e) => {
                  e.preventDefault();
                  makeLink();
                }}
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
