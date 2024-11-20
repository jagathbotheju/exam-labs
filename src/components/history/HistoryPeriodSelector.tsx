"use client";
import React from "react";
import { useHistoryStore } from "@/app/stores/historyStore";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import YearSelector from "./YearSelector";
import { TimeFrame } from "@/lib/types";
import MonthSelector from "./MonthSelector";
import { toast } from "sonner";

interface Props {
  subjectId: string;
}

const HistoryPeriodSelector = ({ subjectId }: Props) => {
  const { timeFrame, setTimeFrame } = useHistoryStore((state) => state);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Tabs
        value={timeFrame}
        onValueChange={(value) => {
          setTimeFrame(value as TimeFrame);
        }}
      >
        <TabsList>
          <TabsTrigger value="year">Year</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items=center gap-2">
        <YearSelector subjectId={subjectId} />

        {timeFrame === "month" && <MonthSelector />}
      </div>
    </div>
  );
};

export default HistoryPeriodSelector;
