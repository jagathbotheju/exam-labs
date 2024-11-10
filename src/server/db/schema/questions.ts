import { InferSelectModel, relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { Subject, subjects } from "./subjects";
import { Exam, ExamExt, exams } from "./exams";
import { ExamQuestion, examQuestions } from "./examQuestions";

export const questions = pgTable("questions", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  subjectId: text("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  option1: text("option1"),
  option2: text("option2"),
  option3: text("option3"),
  option4: text("option4"),
  grade: text("year").notNull(),
  term: text("term").notNull().default("all"),
  answer: text("answer").notNull(),
  score: integer("score").default(2.5).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const questionRelations = relations(questions, ({ one, many }) => ({
  subjects: one(subjects, {
    fields: [questions.subjectId],
    references: [subjects.id],
  }),
  examQuestions: many(examQuestions),
}));

export type Question = InferSelectModel<typeof questions>;
export type QuestionExt = InferSelectModel<typeof questions> & {
  examQuestions: ExamQuestion[];
  exams: ExamExt[];
  subjects: Subject[];
};
