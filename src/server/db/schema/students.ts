import { InferSelectModel, relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { ExamExt, exams } from "./exams";
import { StudentExam, studentExams } from "./studentExams";

export const students = pgTable("students", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  password: text("password"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  role: text("role").notNull().default("student"),
  dob: timestamp("dob").notNull(),
  school: text("school").notNull(),
  grade: text("year").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const studentRelations = relations(students, ({ many }) => ({
  exams: many(studentExams),
}));

export type Student = InferSelectModel<typeof students>;
export type StudentExt = InferSelectModel<typeof students> & {
  exams: StudentExam[];
};
