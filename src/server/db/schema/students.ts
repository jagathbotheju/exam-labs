import { InferSelectModel, relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { ExamExt, exams } from "./exams";

export const students = pgTable("students", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  dob: timestamp("dob").notNull(),
  school: text("school").notNull(),
  grade: integer("grade"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const studentRelations = relations(students, ({ many }) => ({
  exams: many(exams),
}));

export type Student = InferSelectModel<typeof students>;
export type StudentExt = InferSelectModel<typeof students> & {
  exams: ExamExt;
};
