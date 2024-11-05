import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { students } from "./students";
import { InferSelectModel, relations } from "drizzle-orm";
import { Question, QuestionExt, questions } from "./questions";
import { Subject, subjects } from "./subjects";
import { ExamQuestion, examQuestions } from "./examQuestions";
import { studentExams } from "./studentExams";
import { StudentAnswer, studentAnswers } from "./studentAnswers";

export const exams = pgTable("exams", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  subjectId: text("subject_id")
    .references(() => subjects.id)
    .notNull(),
  studentId: text("student_id").references(() => students.id),
  name: text("name").notNull(),
  duration: integer("duration"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const examRelations = relations(exams, ({ one, many }) => ({
  examQuestions: many(examQuestions),
  studentAnswers: many(studentAnswers),
  studentExams: many(studentExams),
  students: one(students, {
    fields: [exams.studentId],
    references: [students.id],
  }),
  subjects: one(subjects, {
    fields: [exams.subjectId],
    references: [subjects.id],
  }),
}));

export type Exam = InferSelectModel<typeof exams>;
export type ExamExt = InferSelectModel<typeof exams> & {
  examQuestions: ExamQuestion[];
  studentAnswers: StudentAnswer[];
  subjects: Subject;
};
