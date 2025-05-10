/*
 * The main layout. Its like a tree, first layout then the main
 * content. Its like the top part and bottom part, middle part is
 * the main content.
 */

import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import CookieConsent from '@/components/CookieConsent'
import NavBar from '@/components/navbar'
import { Footer } from '@/components/ui/footer-section'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from 'next-themes'
import { Geist, Noto_Sans_Bengali } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Suspense } from 'react'
import Loading from './loading'
import { Providers } from './providers'
import './global.css'

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

const noto_sans_bengali = Noto_Sans_Bengali({
  variable: '--font-noto-sans-bengali',
  subsets: ['bengali'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Collegiate School Math Club',
    default: 'Collegiate School Math Club',
  },
  generator: 'Next.js',
  applicationName: 'CSMC Website',
  keywords: [
    'Next.js',
    'React',
    'JavaScript',
    'Tailwindcss',
    'TypeScript',
    'Shadcn UI',
    'Aceternity UI',
    'Bun',
  ],
  authors: [{ name: 'Muntasir', url: 'https://muntasirmahmud.me' }, { name: 'Kayef', url: 'https://github.com/Nowazish-Nur-Kayef' }],
  creator: 'Muntasir Mahmud And Nowazish Nur Kayef',
  publisher: 'Muntasir Mahmud And Nowazish Nur Kayef',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  metadataBase: new URL('https://csmc.vercel.app'),
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    statusBarStyle: 'black-translucent',
    title: 'Collegiate School Math Club',
  },
  openGraph: {
    title: 'Collegiate School Math Club',
    description:
      'Meet a new range of thinking with mathematics',
    url: 'https://csmc.vercel.app',
    type: 'website',
    siteName: 'CSMC',
  },
  twitter: {
    site: 'https://csmc.vercel.app',
    creator: 'Muntasir Mahmud And Nowazish Nur Kayef',
    title: 'Collegiate School Math Club',
    description:
      'Meet a new range of thinking with mathematics',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#c0caf5' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2335' },
  ],
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.className} ${noto_sans_bengali.className}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen scroll-smooth">
        <Suspense fallback={<Loading />}>
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
                <main className="pt-15">
                  {children}
                </main>
                <Footer />
              </Providers>
            </ThemeProvider>
          </NuqsAdapter>
        </Suspense>
      </body>
    </html>
  )
}
