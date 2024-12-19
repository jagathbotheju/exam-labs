ALTER TABLE "questions_type_history" ALTER COLUMN "total_questions" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "questions_type_history" ALTER COLUMN "total_questions" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions_type_history" ALTER COLUMN "total_correct_questions" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "questions_type_history" ALTER COLUMN "total_correct_questions" SET NOT NULL;