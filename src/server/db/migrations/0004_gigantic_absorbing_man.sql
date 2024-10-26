ALTER TABLE "students" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "email_verified" timestamp;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "role" text DEFAULT 'student' NOT NULL;