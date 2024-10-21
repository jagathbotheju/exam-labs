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

export const questionsYearHistory = pgTable(
  "questions_year_history",
  {
    questionId: text("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    studentId: text("student_id")
      .notNull()
      .references(() => students.id),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    status: boolean("status").default(false),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.month, table.year, table.questionId] }),
    };
  }
);

export const questionsYearHistoryRelations = relations(
  questionsYearHistory,
  ({ one }) => ({
    students: one(students, {
      fields: [questionsYearHistory.studentId],
      references: [students.id],
    }),
    questions: one(questions, {
      fields: [questionsYearHistory.questionId],
      references: [questions.id],
    }),
  })
);

export type QuestionsYearHistory = InferSelectModel<
  typeof questionsYearHistory
>;
