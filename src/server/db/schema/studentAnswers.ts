import {
  integer,
  pgTable,
  text,
  timestamp,
  customType,
} from "drizzle-orm/pg-core";
import { students } from "./students";
import { exams } from "./exams";
import { InferSelectModel, relations } from "drizzle-orm";
import { Answer, answers } from "./answers";

export const studentAnswers = pgTable("student-answers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  studentId: text("student_id").references(() => students.id),
  examId: text("exam_id").references(() => exams.id),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const studentAnswerRelations = relations(
  studentAnswers,
  ({ one, many }) => ({
    answers: many(answers),
  })
);

export type StudentAnswer = InferSelectModel<typeof studentAnswers>;
export type StudentAnswerExt = InferSelectModel<typeof studentAnswers> & {
  answers: Answer[];
};
