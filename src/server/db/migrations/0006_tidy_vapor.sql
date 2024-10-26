ALTER TABLE "students" ADD COLUMN "year" text NOT NULL;--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN IF EXISTS "grade";