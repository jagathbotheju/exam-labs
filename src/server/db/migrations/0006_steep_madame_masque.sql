ALTER TABLE "student_exams" DROP CONSTRAINT "student_exams_exam_id_exams_id_fk";
--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "option1" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "option2" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "option3" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "option4" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_exams" ADD CONSTRAINT "student_exams_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
