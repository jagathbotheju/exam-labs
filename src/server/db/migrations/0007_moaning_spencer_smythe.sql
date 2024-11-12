CREATE TABLE IF NOT EXISTS "question_types" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "question_types_type_unique" UNIQUE("type")
);
--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "type_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_type_id_question_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."question_types"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
