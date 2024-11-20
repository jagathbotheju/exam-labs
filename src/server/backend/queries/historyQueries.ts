import { useQuery } from "@tanstack/react-query";
import {
  getHistoryYears,
  getMonthHistoryData,
  getYearHistoryData,
} from "../actions/historyActions";

export const useHistoryYears = (subjectId: string) => {
  return useQuery({
    queryKey: ["history-years"],
    queryFn: () => getHistoryYears(subjectId),
  });
};

export const useMonthHistoryData = ({
  subjectId,
  studentId,
  year,
  month,
}: {
  subjectId: string;
  studentId: string;
  year: number;
  month: number;
}) => {
  return useQuery({
    queryKey: ["month-history-data"],
    queryFn: () => getMonthHistoryData({ subjectId, studentId, year, month }),
  });
};

export const useYearHistoryData = ({
  subjectId,
  studentId,
  year,
}: {
  subjectId: string;
  studentId: string;
  year: number;
}) => {
  return useQuery({
    queryKey: ["year-history-data"],
    queryFn: () => getYearHistoryData({ subjectId, studentId, year }),
  });
};
