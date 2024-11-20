"use client";

import { useHistoryStore } from "@/app/stores/historyStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const MonthSelector = () => {
  const { period, setPeriod } = useHistoryStore((state) => state);

  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        setPeriod({
          year: period.year,
          month: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month, index) => {
          const monthStr = new Date(period.year, month, 1).toLocaleString(
            "default",
            { month: "long" }
          );

          return (
            <SelectItem key={month + index} value={month.toString()}>
              {monthStr}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default MonthSelector;
