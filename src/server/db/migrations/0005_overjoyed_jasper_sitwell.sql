CREATE TABLE IF NOT EXISTS "questions_type_history" (
	"question_id" text NOT NULL,
	"question_type_id" text NOT NULL,
	"subject_id" text NOT NULL,
	"student_id" text NOT NULL,
	"total_questions" integer,
	"total_correct_questions" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "questions_type_history_question_type_id_student_id_pk" PRIMARY KEY("question_type_id","student_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions_type_history" ADD CONSTRAINT "questions_type_history_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions_type_history" ADD CONSTRAINT "questions_type_history_question_type_id_question_types_id_fk" FOREIGN KEY ("question_type_id") REFERENCES "public"."question_types"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions_type_history" ADD CONSTRAINT "questions_type_history_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions_type_history" ADD CONSTRAINT "questions_type_history_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
