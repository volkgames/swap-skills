CREATE TYPE "public"."type" AS ENUM('email', 'google', 'github');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('member', 'admin');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"accountType" "type" NOT NULL,
	"githubId" text,
	"googleId" text,
	"password" text,
	"salt" text,
	CONSTRAINT "accounts_githubId_unique" UNIQUE("githubId"),
	CONSTRAINT "accounts_googleId_unique" UNIQUE("googleId")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"displayName" text,
	"imageUrl" text,
	"bio" text DEFAULT '' NOT NULL,
	CONSTRAINT "profiles_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"token" text,
	"tokenExpiresAt" timestamp,
	CONSTRAINT "reset_tokens_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"role" "role" DEFAULT 'member' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verify_email_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"token" text,
	"tokenExpiresAt" timestamp,
	CONSTRAINT "verify_email_tokens_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reset_tokens" ADD CONSTRAINT "reset_tokens_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verify_email_tokens" ADD CONSTRAINT "verify_email_tokens_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_id_account_type_idx" ON "accounts" USING btree ("userId","accountType");--> statement-breakpoint
CREATE INDEX "reset_tokens_token_idx" ON "reset_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "verify_email_tokens_token_idx" ON "verify_email_tokens" USING btree ("token");