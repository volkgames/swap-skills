import {
  boolean,
  index,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["member", "admin"]);
export const accountTypeEnum = pgEnum("type", ["email", "google", "github"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  role: roleEnum("role").notNull().default("member"),
});

export const accounts = pgTable(
  "accounts",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id),
    accountType: accountTypeEnum("accountType").notNull(),
    githubId: text("githubId").unique(),
    googleId: text("googleId").unique(),
    password: text("password"),
    salt: text("salt"),
  },
  (table) => [
    index("user_id_account_type_idx").on(table.userId, table.accountType),
  ]
);

export const resetTokens = pgTable(
  "reset_tokens",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    token: text("token"),
    tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
  },
  (table) => [index("reset_tokens_token_idx").on(table.token)]
);

export const verifyEmailTokens = pgTable(
  "verify_email_tokens",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    token: text("token"),
    tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
  },
  (table) => [index("verify_email_tokens_token_idx").on(table.token)]
);

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  displayName: text("displayName"),
  imageUrl: text("imageUrl"),
  bio: text("bio").notNull().default(""),
});

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)]
);

export const categories = pgEnum("category", [
  "tech",
  "design",
  "language",
  "marketing",
  "other",
]);

export const offers = pgTable(
  "offers",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    offerSkill: text("offerSkill").notNull(),
    requestSkill: text("requestSkill").notNull(),
    description: text("description"),
    category: categories("category").notNull(),
    createdAt: timestamp("createdAt", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    isActive: boolean("isActive").notNull().default(true),
  },
  (table) => [index("offers_user_id_idx").on(table.userId)]
);

export const requests = pgTable(
  "requests",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    offerId: serial("offerId")
      .notNull()
      .references(() => offers.id, {
        onDelete: "cascade",
      }),
    message: text("message").notNull(),
    createdAt: timestamp("createdAt", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    accepted: boolean("accepted"),
  },
  (table) => [index("requests_user_id_idx").on(table.userId)]
);

// types
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;
export type Request = typeof requests.$inferSelect;
export type NewRequest = typeof requests.$inferInsert;
