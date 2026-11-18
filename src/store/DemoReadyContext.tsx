import { createContext, useContext, useEffect } from 'react';

export const DemoReadyContext = createContext<() => void>(() => {});

export function useMarkReady(enabled = true): void {
  const markReady = useContext(DemoReadyContext);
  useEffect(() => {
    if (!enabled) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(markReady));
    return () => cancelAnimationFrame(id);
  }, [enabled, markReady]);
}
