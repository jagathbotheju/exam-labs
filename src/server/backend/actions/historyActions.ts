"use server";
import { getDaysInMonth } from "date-fns";
import { HistoryData } from "@/lib/types";
import { db } from "@/server/db";
import {
  questionsMonthHistory,
  questionsYearHistory,
} from "@/server/db/schema";
import { QuestionsMonthHistory } from "@/server/db/schema/questionsMonthHistory";
import { and, asc, eq, sum, getTableColumns } from "drizzle-orm";
import _ from "lodash";

export const getMonthHistoryData = async ({
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
  const result = await db
    .select()
    .from(questionsMonthHistory)
    .orderBy(asc(questionsMonthHistory.day))
    .where(
      and(
        eq(questionsMonthHistory.subjectId, subjectId),
        eq(questionsMonthHistory.studentId, studentId)
      )
    );

  if (!_.isEmpty(result)) {
    const history: HistoryData[] = [];
    const daysInMonth = getDaysInMonth(new Date(year, month));

    for (let i = 1; i <= daysInMonth; i++) {
      let marks = 0;
      const day = result.find((item) => item.day === i);
      if (day) {
        marks = day.marks || 0;
      }

      history.push({
        marks,
        year,
        month,
        day: i,
      });
    }
    return history;
  }

  return [];
};

export const getYearHistoryData = async ({
  subjectId,
  studentId,
  year,
}: {
  subjectId: string;
  studentId: string;
  year: number;
}) => {
  const result = await db
    .select()
    .from(questionsYearHistory)
    .orderBy(asc(questionsYearHistory.month))
    .where(
      and(
        eq(questionsYearHistory.year, year),
        eq(questionsYearHistory.subjectId, subjectId),
        eq(questionsYearHistory.studentId, studentId)
      )
    );

  if (!_.isEmpty(result)) {
    const historyData: HistoryData[] = [];

    for (let i = 0; i < 12; i++) {
      let marks = 0;

      const month = result.find((item) => item.month === i);
      if (month && month.marks) {
        marks = marks < month.marks ? month.marks : marks;
      }

      historyData.push({
        year,
        month: i,
        marks,
      });
    }
    return historyData;
  }
  return [];
};

export const getHistoryYears = async (subjectId: string) => {
  const result = (await db
    .selectDistinctOn([questionsMonthHistory.year])
    .from(questionsMonthHistory)
    .orderBy(asc(questionsMonthHistory.year))) as QuestionsMonthHistory[];

  if (result) {
    let years = result.map((item) => item.year);
    if (years.length === 0) {
      years = [new Date().getFullYear()];
    }
    return years;
  }
  return [];
};
