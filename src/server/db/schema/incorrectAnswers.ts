import {
  integer,
  pgTable,
  text,
  timestamp,
  customType,
  primaryKey,
} from "drizzle-orm/pg-core";
import { Exam, exams } from "./exams";
import { InferSelectModel, relations } from "drizzle-orm";
import { QuestionExt, questions } from "./questions";
import { QuestionType, questionTypes } from "./questionTypes";
import { User, users } from "./users";

export const incorrectAnswers = pgTable(
  "incorrect_answers",
  {
    studentId: text("student_id").references(() => users.id),
    examId: text("exam_id").references(() => exams.id),
    questionId: text("question_id").references(() => questions.id),
    questionTypeId: text("question_type_id").references(() => questionTypes.id),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.studentId, table.questionId],
    }),
  })
);

export const incorrectAnswerRelations = relations(
  incorrectAnswers,
  ({ many, one }) => ({
    exams: one(exams, {
      fields: [incorrectAnswers.examId],
      references: [exams.id],
    }),
    students: one(users, {
      fields: [incorrectAnswers.studentId],
      references: [users.id],
    }),
    questionTypes: one(questionTypes, {
      fields: [incorrectAnswers.questionTypeId],
      references: [questionTypes.id],
    }),
    // questions: many(questions),
  })
);

export type IncorrectAnswer = InferSelectModel<typeof incorrectAnswers>;
export type IncorrectAnswerExt = InferSelectModel<typeof incorrectAnswers> & {
  exams: Exam;
  students: User;
  questionTypes: QuestionType;
  // questions: QuestionExt[];
};
