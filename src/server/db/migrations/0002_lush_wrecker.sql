ALTER TABLE "student-answers" RENAME COLUMN "answer" TO "question_answer";--> statement-breakpoint
ALTER TABLE "student-answers" ADD COLUMN "student_answer" text;