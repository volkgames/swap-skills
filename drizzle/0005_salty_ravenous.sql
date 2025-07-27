ALTER TABLE "requests" ALTER COLUMN "accepted" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "requests" ALTER COLUMN "accepted" DROP NOT NULL;