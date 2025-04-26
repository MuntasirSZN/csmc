import type { ReactNode } from 'react'
import CookieConsent from '@/components/CookieConsent'
import NavBar from '@/components/navbar'
import { Footer } from '@/components/ui/footer-section'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from 'next-themes'
import { Inter, Noto_Sans_Bengali } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Providers } from './providers'
import './global.css'

const inter = Inter({
  variable: '--font-inter',
})

const noto_sans_bengali = Noto_Sans_Bengali({
  variable: '--font-noto-sans-bengali',
})

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} ${noto_sans_bengali.className}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen scroll-smooth">
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <Toaster />
              <NavBar />
              <CookieConsent />
              {children}
            </Providers>
            <Footer />
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
