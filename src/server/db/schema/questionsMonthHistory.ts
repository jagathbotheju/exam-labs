import { InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { questions } from "./questions";
import { students } from "./students";

export const questionsMonthHistory = pgTable(
  "questions_month_history",
  {
    questionId: text("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    studentId: text("student_id")
      .notNull()
      .references(() => students.id),
    day: integer("day").notNull(),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    status: boolean("status").default(false),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.day, table.month, table.year, table.questionId],
      }),
    };
  }
);

export const questionsMonthHistoryRelations = relations(
  questionsMonthHistory,
  ({ one }) => ({
    students: one(students, {
      fields: [questionsMonthHistory.studentId],
      references: [students.id],
    }),
    questions: one(questions, {
      fields: [questionsMonthHistory.questionId],
      references: [questions.id],
    }),
  })
);

export type QuestionsMonthHistory = InferSelectModel<
  typeof questionsMonthHistory
>;
