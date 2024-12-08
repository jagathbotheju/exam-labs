import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { Subject, subjects } from "./subjects";

export const questionTypes = pgTable("question_types", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  type: text("type").unique().notNull(),
  subjectId: text("subject_id").references(() => subjects.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const questionTypesRelations = relations(questionTypes, ({ one }) => ({
  exams: one(subjects, {
    fields: [questionTypes.subjectId],
    references: [subjects.id],
  }),
}));

export type QuestionType = InferSelectModel<typeof questionTypes>;
export type QuestionTypeExt = InferSelectModel<typeof questionTypes> & {
  subject: Subject;
};
