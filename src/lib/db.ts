/*
 * Initialization of database here. Use it to
 * do database operations.
 */

import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

export const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_TOKEN,
  },
  schema,
})
