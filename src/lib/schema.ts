/*
 * Database schema, maintained with migrations
 * by drizzle. Use db:generate to generate and db:migrate to
 * migrate (i.e push to database.)
 */

import { relations, sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' })
    .default(false)
    .notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text('role'),
  banned: integer('banned', { mode: 'boolean' }).default(false),
  banReason: text('ban_reason'),
  banExpires: integer('ban_expires', { mode: 'timestamp_ms' }),
  normalizedEmail: text('normalized_email').unique(),
  twoFactorEnabled: integer('two_factor_enabled', { mode: 'boolean' }).default(
    false,
  ),
})

export const account = sqliteTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: integer('access_token_expires_at', {
      mode: 'timestamp_ms',
    }),
    refreshTokenExpiresAt: integer('refresh_token_expires_at', {
      mode: 'timestamp_ms',
    }),
    scope: text('scope'),
    password: text('password'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  table => [index('account_userId_idx').on(table.userId)],
)

export const passkey = sqliteTable(
  'passkey',
  {
    id: text('id').primaryKey(),
    name: text('name'),
    publicKey: text('public_key').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    credentialID: text('credential_id').notNull(),
    counter: integer('counter').notNull(),
    deviceType: text('device_type').notNull(),
    backedUp: integer('backed_up', { mode: 'boolean' }).notNull(),
    transports: text('transports'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }),
    aaguid: text('aaguid'),
  },
  table => [
    index('passkey_userId_idx').on(table.userId),
    index('passkey_credentialID_idx').on(table.credentialID),
  ],
)

export const twoFactor = sqliteTable(
  'two_factor',
  {
    id: text('id').primaryKey(),
    secret: text('secret').notNull(),
    backupCodes: text('backup_codes').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    verified: integer('verified', { mode: 'boolean' }).default(true),
  },
  table => [
    index('twoFactor_secret_idx').on(table.secret),
    index('twoFactor_userId_idx').on(table.userId),
  ],
)

export const practices = sqliteTable('practices', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  content: text('content').notNull(),
  timeLimit: integer('time_limit').default(30).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
})

export const questions = sqliteTable('questions', {
  id: integer('id').primaryKey(),
  practiceId: integer('practice_id')
    .notNull()
    .references(() => practices.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  options: text('options', { mode: 'json' }).$type<string[]>(),
  correctAnswer: text('correct_answer'),
  correctAnswers: text('correct_answers', { mode: 'json' }).$type<string[]>(),
  explanation: text('explanation'),
  questionType: text('question_type').default('option').notNull(),
  answerType: text('answer_type').default('single').notNull(),
  order: integer('order').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
})

export const practiceAttempts = sqliteTable('practice_attempts', {
  id: integer('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  practiceId: integer('practice_id')
    .notNull()
    .references(() => practices.id, { onDelete: 'cascade' }),
  startedAt: integer('started_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
  timeSpent: integer('time_spent'),
  score: integer('score'),
  answers: text('answers', { mode: 'json' }).$type<Record<number, string | string[]>>(),
})

export const ContactSubmissions = sqliteTable('ContactSubmissions', {
  id: integer('id').primaryKey(),
  firstName: text('firstName'),
  lastName: text('lastName'),
  email: text('email').notNull(),
  message: text('message'),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`),
})

export const NewsletterSubscriptions = sqliteTable('NewsletterSubscriptions', {
  id: integer('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`),
})

export const authSchema = {
  user,
  account,
  passkey,
  twoFactor,
}

export const practicesRelations = relations(practices, ({ many }) => ({
  questions: many(questions),
  attempts: many(practiceAttempts),
}))

export const questionsRelations = relations(questions, ({ one }) => ({
  practice: one(practices, {
    fields: [questions.practiceId],
    references: [practices.id],
  }),
}))

export const usersRelations = relations(user, ({ many }) => ({
  attempts: many(practiceAttempts),
}))

export const practiceAttemptsRelations = relations(practiceAttempts, ({ one }) => ({
  user: one(user, {
    fields: [practiceAttempts.userId],
    references: [user.id],
  }),
  practice: one(practices, {
    fields: [practiceAttempts.practiceId],
    references: [practices.id],
  }),
}))

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  twoFactors: many(twoFactor),
  passkeys: many(passkey),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const twoFactorRelations = relations(twoFactor, ({ one }) => ({
  user: one(user, {
    fields: [twoFactor.userId],
    references: [user.id],
  }),
}))

export const passkeyRelations = relations(passkey, ({ one }) => ({
  user: one(user, {
    fields: [passkey.userId],
    references: [user.id],
  }),
}))
