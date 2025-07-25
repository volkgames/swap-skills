ALTER TABLE "posts" RENAME TO "offers";--> statement-breakpoint
ALTER TABLE "offers" DROP CONSTRAINT "posts_userId_users_id_fk";
--> statement-breakpoint
DROP INDEX "posts_user_id_idx";--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "offers_user_id_idx" ON "offers" USING btree ("userId");