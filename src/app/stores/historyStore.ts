import { Period } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HistoryStore = {
  timeFrame: "month" | "year";
  period: Period;
  setTimeFrame: (timeFrame: "month" | "year") => void;
  setPeriod: (period: Period) => void;
};

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      timeFrame: "month",
      period: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      setTimeFrame: (timeFrame) => {
        set(() => ({
          timeFrame,
        }));
      },

      setPeriod: (period) => {
        set(() => ({
          period,
        }));
      },
    }),
    {
      name: "history-store",
    }
  )
);
