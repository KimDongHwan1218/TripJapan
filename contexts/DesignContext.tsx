import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

// 화면별 디자인 시안 비교 장치(개발 단계용).
// - 화면마다 시안 개수가 다름: 홈은 3개, 공지사항은 완성이라 0개(등록 안 함) — 전역 "디자인 모드"가 아님.
// - 화면은 useScreenVariant(key, ["현재", "시안 B", ...])로 시안을 등록하고, 지금 고른 번호(0부터)를 받는다.
// - 우상단 플로팅 버튼(DesignVariantPicker)이 "지금 포커스된 화면"의 시안 목록을 보여주고 고르게 함.
// - 규칙: 0번 = 현재(기준) 디자인 — 0번 코드는 손대지 않는다. 채택되면 그 시안을 0번으로 승격하고 나머지는 지운다.
// - 고른 시안은 화면 key별로 저장돼 앱을 다시 켜도 유지.
const STORAGE_KEY = "@tabi_screen_variants";

type Registration = { key: string; variants: readonly string[] };

type Ctx = {
  selection: Record<string, number>;
  select: (key: string, index: number) => void;
  current: Registration | null;
  setCurrent: React.Dispatch<React.SetStateAction<Registration | null>>;
};

const DesignContext = createContext<Ctx | null>(null);

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState<Registration | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => v && setSelection(JSON.parse(v)))
      .catch(() => {});
  }, []);

  const select = useCallback((key: string, index: number) => {
    setSelection((prev) => {
      const next = { ...prev, [key]: index };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo(() => ({ selection, select, current, setCurrent }), [selection, select, current]);
  return <DesignContext.Provider value={value}>{children}</DesignContext.Provider>;
}

export function useDesignContext() {
  const ctx = useContext(DesignContext);
  if (!ctx) throw new Error("useDesignContext must be used within DesignProvider");
  return ctx;
}

/**
 * 화면의 디자인 시안을 등록하고 지금 고른 시안 번호를 돌려준다.
 * 화면이 포커스될 때 우상단 선택 버튼이 이 목록을 보여준다. 배포 빌드에선 항상 0(현재 디자인).
 * 예) const variant = useScreenVariant("home", ["현재", "상황별 홈"]);
 */
export function useScreenVariant(key: string, variants: readonly string[]): number {
  const { selection, setCurrent } = useDesignContext();
  const reg = useRef<Registration>({ key, variants });
  reg.current = { key, variants };

  useFocusEffect(
    useCallback(() => {
      setCurrent(reg.current);
      // 화면 전환 시 "새 화면 등록 → 옛 화면 정리" 순서로 실행되기도 해서, 무조건 null로 지우면
      // 새 화면 등록까지 지워짐(실기기에서 버튼이 사라지거나 이전 화면 시안이 남던 문제) → 내 등록일 때만 지움
      return () => setCurrent((cur) => (cur?.key === key ? null : cur));
    }, [setCurrent, key])
  );

  if (!__DEV__) return 0;
  const idx = selection[key] ?? 0;
  return idx < variants.length ? idx : 0;
}
