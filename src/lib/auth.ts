import { db } from '@/lib/db'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { haveIBeenPwned, openAPI } from 'better-auth/plugins'
import { passkey } from 'better-auth/plugins/passkey'

export const auth = betterAuth({
  appName: 'Collegiate School Math Club',
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [
    haveIBeenPwned(),
    openAPI(),
    passkey({
      rpID: 'CSMC',
      rpName: 'Collegiate School Math Club',
      origin: process.env.BASE_URL!,
    }),
  ],
})
