ALTER TABLE "students" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_email_unique" UNIQUE("email");