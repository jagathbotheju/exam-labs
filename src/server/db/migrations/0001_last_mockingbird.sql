CREATE TABLE IF NOT EXISTS "incorrect_answers" (
	"student_id" text,
	"exam_id" text,
	"question_id" text,
	"question_type_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "incorrect_answers_student_id_question_id_pk" PRIMARY KEY("student_id","question_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "incorrect_answers" ADD CONSTRAINT "incorrect_answers_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "incorrect_answers" ADD CONSTRAINT "incorrect_answers_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "incorrect_answers" ADD CONSTRAINT "incorrect_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "incorrect_answers" ADD CONSTRAINT "incorrect_answers_question_type_id_question_types_id_fk" FOREIGN KEY ("question_type_id") REFERENCES "public"."question_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
