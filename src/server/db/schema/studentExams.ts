import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { ExamExt, exams } from "./exams";
import { Student, students } from "./students";
import { InferSelectModel, relations } from "drizzle-orm";
import { Question } from "./questions";

export const studentExams = pgTable(
  "student_exams",
  {
    studentId: text("student_id")
      .notNull()
      .references(() => students.id),
    examId: text("exam_id")
      .notNull()
      .references(() => exams.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.studentId, table.examId] }),
  })
);

export const studentExamRelations = relations(studentExams, ({ one }) => ({
  exams: one(exams, {
    fields: [studentExams.examId],
    references: [exams.id],
  }),
  questions: one(students, {
    fields: [studentExams.studentId],
    references: [students.id],
  }),
}));

export type StudentExam = InferSelectModel<typeof studentExams> & {
  exams: ExamExt;
  students: Student;
};
