import type { ReactNode } from 'react'
import CookieConsent from '@/components/CookieConsent'
import NavBar from '@/components/navbar'
import { Footer } from '@/components/ui/footer-section'
import { Toaster } from '@/components/ui/sonner'
import { RootProvider } from 'fumadocs-ui/provider'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './global.css'

const inter = Inter({
  subsets: ['latin'],
})

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen scroll-smooth">
        <RootProvider>
          <Toaster />
          <NavBar />
          <CookieConsent />
          <Providers>
            {children}
          </Providers>
          <Footer />
        </RootProvider>
      </body>
    </html>
  )
}
