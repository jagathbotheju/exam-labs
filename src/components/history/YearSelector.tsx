"use client";
import React from "react";
import { useHistoryStore } from "@/app/stores/historyStore";
import { useHistoryYears } from "@/server/backend/queries/historyQueries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  subjectId: string;
}

const YearSelector = ({ subjectId }: Props) => {
  const { period, setPeriod } = useHistoryStore((state) => state);
  const { data: historyYears } = useHistoryYears(subjectId);

  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({
          month: period.month,
          year: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {historyYears?.map((year, index) => (
          <SelectItem key={year + index} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default YearSelector;
