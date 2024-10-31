import {
  integer,
  pgTable,
  text,
  timestamp,
  customType,
} from "drizzle-orm/pg-core";
import { questions } from "./questions";
import { InferSelectModel, relations } from "drizzle-orm";
import { studentAnswers } from "./studentAnswers";

export const answers = pgTable("answers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  questionId: text("question_id").references(() => questions.id),
  answerOption: text("answer_option"),
  studentOption: text("answer_option"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const answerRelations = relations(answers, ({ one }) => ({
  studentAnswers: one(studentAnswers, {
    fields: [answers.id],
    references: [studentAnswers.id],
  }),
}));

export type Answer = InferSelectModel<typeof answers>;
