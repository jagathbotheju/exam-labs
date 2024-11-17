import {
  integer,
  pgTable,
  text,
  timestamp,
  customType,
  primaryKey,
} from "drizzle-orm/pg-core";
import { students } from "./students";
import { exams } from "./exams";
import { InferSelectModel, relations } from "drizzle-orm";
import { StudentResponse } from "@/lib/types";
import { questions } from "./questions";
import { QuestionType, questionTypes } from "./questionTypes";

export const studentAnswers = pgTable(
  "student-answers",
  {
    studentId: text("student_id").references(() => students.id),
    examId: text("exam_id").references(() => exams.id),
    questionId: text("question_id").references(() => questions.id),
    questionTypeId: text("question_type_id").references(() => questionTypes.id),
    questionAnswer: text("question_answer"),
    studentAnswer: text("student_answer"),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.examId, table.studentId, table.questionId],
    }),
  })
);

export const studentAnswerRelations = relations(
  studentAnswers,
  ({ many, one }) => ({
    exams: one(exams, {
      fields: [studentAnswers.examId],
      references: [exams.id],
    }),
    students: one(students, {
      fields: [studentAnswers.studentId],
      references: [students.id],
    }),
    questionTypes: one(questionTypes, {
      fields: [studentAnswers.questionTypeId],
      references: [questionTypes.id],
    }),
  })
);

export type StudentAnswer = InferSelectModel<typeof studentAnswers>;
export type StudentAnswerExt = InferSelectModel<typeof studentAnswers> & {
  questionTypes: QuestionType;
};
