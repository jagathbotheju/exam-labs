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
import { Subject, subjects } from "./subjects";
import { exams } from "./exams";
import { users } from "./users";

export const questionsYearHistory = pgTable(
  "questions_year_history",
  {
    examId: text("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    studentId: text("student_id")
      .notNull()
      .references(() => users.id),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    marks: integer("marks").default(0),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.month, table.year, table.subjectId, table.studentId],
      }),
    };
  }
);

// export const questionsYearHistoryRelations = relations(
//   questionsYearHistory,
//   ({ many }) => ({
//     subjects: many(subjects),
//   })
// );

export type QuestionsYearHistory = InferSelectModel<
  typeof questionsYearHistory
>;

// export type QuestionsYearHistoryExt = InferSelectModel<
//   typeof questionsYearHistory
// > & {
//   subjects: Subject[];
// };
