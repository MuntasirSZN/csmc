/*
 * The client instance of authentication. Use on client
 * components only.
 */

import { passkeyClient } from '@better-auth/passkey/client'
import { adminClient, twoFactorClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  plugins: [
    passkeyClient(),
    twoFactorClient(),
    adminClient(),
  ],
})
