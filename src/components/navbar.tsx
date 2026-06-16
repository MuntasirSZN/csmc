'use client'

import { SignedIn, SignedOut, UserButton } from '@daveyplate/better-auth-ui'
import { LogIn } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useReducer, useState } from 'react'
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

interface ScrollState {
  prevScrollPos: number
  visible: boolean
  isScrolled: boolean
}

interface ScrollAction { type: 'SCROLL', currentScrollPos: number }

function scrollReducer(state: ScrollState, action: ScrollAction): ScrollState {
  switch (action.type) {
    case 'SCROLL':
      return {
        prevScrollPos: action.currentScrollPos,
        visible: state.prevScrollPos > action.currentScrollPos || action.currentScrollPos < 10,
        isScrolled: action.currentScrollPos > 10,
      }
    default:
      return state
  }
}

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
  const [scrollState, dispatchScroll] = useReducer(scrollReducer, { prevScrollPos: 0, visible: true, isScrolled: false })
  const { prevScrollPos, visible, isScrolled } = scrollState

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY

      dispatchScroll({ type: 'SCROLL', currentScrollPos })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
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
