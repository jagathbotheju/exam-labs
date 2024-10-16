import { InferSelectModel, relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { subjects } from "./subjects";

export const questions = pgTable("questions", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  subjectId: text("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  option1: text("option1").notNull(),
  option2: text("option2").notNull(),
  option3: text("option3").notNull(),
  option4: text("option4").notNull(),
  grade: text("year").notNull(),
  term: text("term").notNull().default("all"),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const questionRelations = relations(questions, ({ one }) => ({
  subjects: one(subjects, {
    fields: [questions.subjectId],
    references: [subjects.id],
  }),
}));

export type Question = InferSelectModel<typeof questions>;
