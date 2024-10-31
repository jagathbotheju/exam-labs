CREATE TABLE IF NOT EXISTS "subjects" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subjects_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "questions_year_history" (
	"question_id" text NOT NULL,
	"student_id" text NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"status" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "questions_year_history_month_year_question_id_pk" PRIMARY KEY("month","year","question_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "questions_month_history" (
	"question_id" text NOT NULL,
	"student_id" text NOT NULL,
	"day" integer NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"status" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "questions_month_history_day_month_year_question_id_pk" PRIMARY KEY("day","month","year","question_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "students" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"password" text,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"image" text,
	"role" text DEFAULT 'student' NOT NULL,
	"dob" timestamp NOT NULL,
	"school" text NOT NULL,
	"year" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "students_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exam-questions" (
	"exam_id" text NOT NULL,
	"question_id" text NOT NULL,
	CONSTRAINT "exam-questions_exam_id_question_id_pk" PRIMARY KEY("exam_id","question_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student_exams" (
	"student_id" text NOT NULL,
	"exam_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"marks" integer DEFAULT 0,
	"duration" integer DEFAULT 0,
	CONSTRAINT "student_exams_student_id_exam_id_pk" PRIMARY KEY("student_id","exam_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_tokens" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "email_tokens_id_token_pk" PRIMARY KEY("id","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "password_reset_tokens_id_token_pk" PRIMARY KEY("id","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "questions" (
	"id" text PRIMARY KEY NOT NULL,
	"subject_id" text NOT NULL,
	"body" text NOT NULL,
	"option1" text NOT NULL,
	"option2" text NOT NULL,
	"option3" text NOT NULL,
	"option4" text NOT NULL,
	"year" text NOT NULL,
	"term" text DEFAULT 'all' NOT NULL,
	"answer" text NOT NULL,
	"score" integer DEFAULT 2.5 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "answers" (
	"id" text PRIMARY KEY NOT NULL,
	"question_id" text,
	"answer_option" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exams" (
	"id" text PRIMARY KEY NOT NULL,
	"subject_id" text NOT NULL,
	"student_id" text,
	"name" text NOT NULL,
	"duration" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student-answers" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text,
	"exam_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "student-answers_exam_id_student_id_pk" PRIMARY KEY("exam_id","student_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions_year_history" ADD CONSTRAINT "questions_year_history_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions_year_history" ADD CONSTRAINT "questions_year_history_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions_month_history" ADD CONSTRAINT "questions_month_history_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions_month_history" ADD CONSTRAINT "questions_month_history_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam-questions" ADD CONSTRAINT "exam-questions_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam-questions" ADD CONSTRAINT "exam-questions_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_exams" ADD CONSTRAINT "student_exams_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_exams" ADD CONSTRAINT "student_exams_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exams" ADD CONSTRAINT "exams_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exams" ADD CONSTRAINT "exams_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student-answers" ADD CONSTRAINT "student-answers_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student-answers" ADD CONSTRAINT "student-answers_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
