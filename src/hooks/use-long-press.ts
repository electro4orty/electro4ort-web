import { useCallback, useRef } from 'react';

export function useLongPress(onLongTouch: () => void) {
  const timeStartRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const onDown = useCallback(() => {
    timeStartRef.current = Date.now();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onLongTouch();
    }, 500);
  }, [onLongTouch]);

  const onUp = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return {
    onMouseDown: onDown,
    onMouseUp: onUp,
    onTouchStart: onDown,
    onTouchEnd: onUp,
    onContextMenu,
  };
}
