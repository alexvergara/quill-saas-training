ALTER TABLE "users" ADD COLUMN "stripe_current_period_end_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "stripe_current_period_end";