import { useState, useCallback } from "react";

export function useModal<T = any>() {
  const [visible, setVisible] = useState(false);
  const [payload, setPayload] = useState<T | null>(null);

  const open = useCallback((data?: T) => {
    setPayload(data ?? null);
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setPayload(null);
  }, []);

  return {
    visible,
    payload,
    
    setVisible,
    setPayload,
    open,
    close,
  };
}