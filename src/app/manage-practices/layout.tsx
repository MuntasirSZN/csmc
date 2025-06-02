import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { forbidden } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    forbidden()
  }
  else if (session.user.role !== 'admin') {
    forbidden()
  }

  return (
    <>
      {children}
    </>
  )
}
