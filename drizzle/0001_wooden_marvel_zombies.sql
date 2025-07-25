CREATE TYPE "public"."category" AS ENUM('tech', 'design', 'language', 'marketing', 'other');--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"offerSkill" text NOT NULL,
	"requestSkill" text NOT NULL,
	"description" text,
	"category" "category" NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "posts_user_id_idx" ON "posts" USING btree ("userId");