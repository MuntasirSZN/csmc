'use client'

import { SignedIn, SignedOut, UserButton } from '@daveyplate/better-auth-ui'
import { LogIn } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarLogo,
  NavBody,
  NavItems,
} from '@/components/ui/resizable-navbar'
import { authClient } from '@/lib/auth-client'

export default function NavBar() {
  const { data: session } = authClient.useSession()
  const navItems = [
    {
      name: 'Home',
      link: '/',
    },
    {
      name: 'About',
      link: '/about',
    },
    {
      name: 'Contests',
      link: '/contests',
    },
    {
      name: 'Practices',
      link: '/practices',
    },
    {
      name: 'Contact',
      link: '/contact',
    },
  ]
  if (session && session.user.role === 'admin') {
    navItems.push({ name: 'Manage Practices', link: '/manage-practices' })
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY

      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10)

      setIsScrolled(currentScrollPos > 10)

      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prevScrollPos])

  return (
    <div
      className={`fixed w-full z-50 transition-all duration-300 ${visible
        ? 'top-0'
        : '-top-full'
      } ${isScrolled && visible
        ? 'bg-background/70 backdrop-blur-lg shadow-md'
        : 'bg-background'
      }`}
    >
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="relative z-[100] flex items-center gap-4">
            <SignedIn>
              <UserButton size="icon" />
            </SignedIn>
            <SignedOut>
              <Button render={<Link href="/auth/sign-in" />} nativeButton={false}>
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </SignedOut>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map(item => (
              <Link
                key={`mobile-${item.link}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4">
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <Button className="w-full" render={<Link href="/auth/sign-in" />} nativeButton={false} onClick={() => setIsMobileMenuOpen(false)}>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </SignedOut>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  )
}
