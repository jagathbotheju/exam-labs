ALTER TABLE "questions" ALTER COLUMN "option1" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "option2" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "option3" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "option4" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "year" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "term" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "answer" SET DATA TYPE text;