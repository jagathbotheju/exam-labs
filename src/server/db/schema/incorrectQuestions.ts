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
import { subjects } from "./subjects";

export const incorrectQuestions = pgTable(
  "incorrect_questions",
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

export const incorrectQuestionRelations = relations(
  incorrectQuestions,
  ({ many, one }) => ({
    exams: one(exams, {
      fields: [incorrectQuestions.examId],
      references: [exams.id],
    }),
    students: one(users, {
      fields: [incorrectQuestions.studentId],
      references: [users.id],
    }),
    questionTypes: one(questionTypes, {
      fields: [incorrectQuestions.questionTypeId],
      references: [questionTypes.id],
    }),
    questions: one(questions, {
      fields: [incorrectQuestions.questionId],
      references: [questions.id],
    }),
  })
);

export type IncorrectQuestion = InferSelectModel<typeof incorrectQuestions>;
export type IncorrectQuestionExt = InferSelectModel<
  typeof incorrectQuestions
> & {
  exams: Exam;
  students: User;
  questionTypes: QuestionType;
  questions: QuestionExt;
};
