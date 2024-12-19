import { InferSelectModel, relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { questions } from "./questions";
import { subjects } from "./subjects";
import { users } from "./users";
import { questionTypes } from "./questionTypes";

export const questionsTypeHistory = pgTable(
  "questions_type_history",
  {
    questionId: text("question_id")
      .notNull()
      .references(() => questions.id),
    questionTypeId: text("question_type_id")
      .notNull()
      .references(() => questionTypes.id, { onDelete: "cascade" }),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    studentId: text("student_id")
      .notNull()
      .references(() => users.id),
    totalQuestions: integer("total_questions").notNull().default(0),
    totalCorrectQuestions: integer("total_correct_questions")
      .notNull()
      .default(0),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.questionTypeId, table.studentId, table.questionId],
      }),
    };
  }
);

export type QuestionsTypeHistory = InferSelectModel<
  typeof questionsTypeHistory
>;
