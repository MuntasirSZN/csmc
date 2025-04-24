import type { ReactNode } from 'react'
import CookieConsent from '@/components/CookieConsent'
import NavBar from '@/components/navbar'
import { Footer } from '@/components/ui/footer-section'
import { Toaster } from '@/components/ui/sonner'
import { RootProvider } from 'fumadocs-ui/provider'
import { Fira_Code, Inter } from 'next/font/google'
import { Providers } from './providers'
import './global.css'

const inter = Inter({
  variable: '--font-inter',
})

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
})

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} ${firaCode.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen scroll-smooth">
        <RootProvider>
          <Providers>
            <Toaster />
            <NavBar />
            <CookieConsent />
            {children}
          </Providers>
          <Footer />
        </RootProvider>
      </body>
    </html>
  )
}
