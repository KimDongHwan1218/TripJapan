import React, { createContext, useContext } from "react";
import { useModal } from "@/hooks/useModal";
import type { Schedule } from "@/contexts/TripContext";

type ScheduleModalPayload = {
  tripdayid?: number;       // 생성용
  schedule?: Schedule; // 편집용
};

type UIContextType = {
  scheduleModal: ReturnType<typeof useModal<ScheduleModalPayload>>;
  openScheduleCreate: (tripdayid: number) => void;
  openScheduleEdit: (schedule: Schedule) => void;
};

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const scheduleModal = useModal<ScheduleModalPayload>();

  const openScheduleCreate = (tripdayid?: number) => {
    scheduleModal.open({ tripdayid });
    scheduleModal.setPayload({ tripdayid });
    scheduleModal.setVisible(true);
  };

  const openScheduleEdit = (schedule: Schedule) => {
    scheduleModal.open({ schedule });
    scheduleModal.setPayload({ schedule });
    scheduleModal.setVisible(true);
  };

  return (
    <UIContext.Provider
      value={{
        scheduleModal,
        openScheduleCreate,
        openScheduleEdit,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
