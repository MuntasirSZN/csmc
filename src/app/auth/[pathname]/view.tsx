/*
 * The client part is here. See the page.tsx for generation.
 */

'use client'

import { AuthCard } from '@daveyplate/better-auth-ui'

export function AuthView({ pathname }: { pathname: string }) {
  return (
    <main className="flex flex-col grow p-4 items-center justify-center pt-15">
      <AuthCard pathname={pathname} />
    </main>
  )
}
