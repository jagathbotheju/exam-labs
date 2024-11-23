import {
  doublePrecision,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { ExamExt, exams } from "./exams";
import { InferSelectModel, relations } from "drizzle-orm";
import { Question } from "./questions";
import { User, users } from "./users";

export const studentExams = pgTable(
  "student_exams",
  {
    studentId: text("student_id")
      .notNull()
      .references(() => users.id),
    examId: text("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    completedAt: timestamp("completed_at", { mode: "string" }),
    marks: doublePrecision("marks").default(0),
    duration: integer("duration").default(0),
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
  questions: one(users, {
    fields: [studentExams.studentId],
    references: [users.id],
  }),
}));

export type StudentExam = InferSelectModel<typeof studentExams>;
export type StudentExamExt = InferSelectModel<typeof studentExams> & {
  exams: ExamExt;
  students: User;
};
