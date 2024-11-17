import { InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  integer,
  PgInteger,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { questions } from "./questions";
import { students } from "./students";
import { exams } from "./exams";
import { Subject, subjects } from "./subjects";

export const questionsMonthHistory = pgTable(
  "questions_month_history",
  {
    examId: text("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    studentId: text("student_id")
      .notNull()
      .references(() => students.id),
    subjectId: text("subject_id").references(() => subjects.id, {
      onDelete: "cascade",
    }),
    marks: integer("marks").default(0),
    day: integer("day").notNull(),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.day, table.month, table.year, table.subjectId],
      }),
    };
  }
);

// export const questionsMonthHistoryRelations = relations(
//   questionsMonthHistory,
//   ({ many }) => ({
//     subjects: many(subjects),
//   })
// );

export type QuestionsMonthHistory = InferSelectModel<
  typeof questionsMonthHistory
>;
// export type QuestionsMonthHistoryExt = InferSelectModel<
//   typeof questionsMonthHistory
// > & {
//   subjects: Subject[];
// };
