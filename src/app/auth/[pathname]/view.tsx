'use client'

import { AuthCard } from '@daveyplate/better-auth-ui'

export function AuthView({
  pathname,
}: {
  pathname: string
}) {
  return (
    <main className="flex flex-col grow p-4 items-center justify-center">
      <AuthCard pathname={pathname} />
    </main>
  )
}
