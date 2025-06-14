/*
 * The file thats added in layout.tsx as a wrapper. Provides different
 * functionalities to the full web app.
 */

'use client'

import type { ReactNode } from 'react'
import { AuthUIProvider } from '@daveyplate/better-auth-ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => {
        // Clear router cache (protected routes)
        router.refresh()
      }}
      Link={Link}
      colorIcons={true}
      passkey
      credentials={{
        rememberMe: true,
        confirmPassword: true,
      }}
      deleteUser={{
        verification: true,
      }}
      avatar
      emailVerification
      social={{
        providers: ['github', 'google', 'facebook'],
      }}
      twoFactor={['otp', 'totp']}
    >
      {children}
    </AuthUIProvider>
  )
}
