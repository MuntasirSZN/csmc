'use client'

import type { ReactNode } from 'react'
import { authClient } from '@/lib/auth-client'
import { AuthUIProvider } from '@daveyplate/better-auth-ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
      colorIcons
      passkey
      rememberMe
      avatar
      confirmPassword
      deleteAccountVerification
      emailVerification
      providers={['github', 'google', 'facebook']}
      twoFactor={['otp', 'totp']}
    >
      {children}
    </AuthUIProvider>
  )
}
