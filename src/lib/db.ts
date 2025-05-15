/*
 * Initialization of database here. Use it to
 * do database operations.
 */

import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
})
