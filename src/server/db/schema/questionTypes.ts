import { InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const questionTypes = pgTable("question_types", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  type: text("type").unique().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export type QuestionType = InferSelectModel<typeof questionTypes>;
