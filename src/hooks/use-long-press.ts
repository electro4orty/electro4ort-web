import { useCallback, useRef } from 'react';

export function useLongTouch(onLongTouch: () => void) {
  const timeStartRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const onMouseDown = useCallback(() => {
    timeStartRef.current = Date.now();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onLongTouch();
    }, 500);
  }, [onLongTouch]);

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return {
    onMouseDown,
    onContextMenu,
  };
}
