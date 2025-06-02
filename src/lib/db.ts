/*
 * Initialization of database here. Use it to
 * do database operations.
 */

// import { upstashCache } from 'drizzle-orm/cache/upstash'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

export const db = drizzle(process.env.DATABASE_URL!, {
//  cache: upstashCache({
//    url: process.env.UPSTASH_REDIS_REST_URL!,
//    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
//    global: true,
//    config: {
//      ex: 30 * 60,
//    },
//  }),
  schema,
})
