ALTER TABLE "question_types" ADD COLUMN "subject_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question_types" ADD CONSTRAINT "question_types_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
