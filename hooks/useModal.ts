import { useCallback, useState } from "react";

// 모달 open/close 패턴 통일용
export function useModal(initial = false) {
  const [visible, setVisible] = useState(initial);

  const open = useCallback(() => {
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  const toggle = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  return {
    visible,
    open,
    close,
    toggle,
  };
}