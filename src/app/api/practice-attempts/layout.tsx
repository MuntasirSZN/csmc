import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { unauthorized } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function PracticeApiLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    unauthorized()
  }
  return (
    <>
      {children}
    </>
  )
}
