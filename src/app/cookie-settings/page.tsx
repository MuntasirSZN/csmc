/*
 * Cookie settings page, link in the footer.
 * /cookie-settings
 */

import type { Metadata } from 'next'
import { CookieIcon } from 'lucide-react'
import CookiePreferencesForm from '@/components/cookie-preferences-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Cookie Settings',
  description: 'All about cookies in CSMC page.',
}

export default function CookiePolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CookieIcon size={24} />
            <CardTitle className="text-3xl font-bold">Cookie Policy</CardTitle>
          </div>
          <CardDescription>Last updated: April 20, 2025</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">What Are Cookies</h2>
            <p className="text-sm">
              Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the website or a third-party to recognize you and make your next visit easier and the website more useful to you.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">How We Use Cookies</h2>
            <p className="text-sm">
              We use cookies for various purposes including:
            </p>
            <ul className="list-disc pl-6 mt-2 text-sm">
              <li>Understanding and saving user preferences for future visits.</li>
              <li>Keeping track of advertisements.</li>
              <li>Compiling aggregate data about site traffic and site interactions.</li>
              <li>Collecting statistical information about the behavior of visitors to our website.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Types of Cookies We Use</h2>
            <CookiePreferencesForm />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Third-Party Cookies</h2>
            <p className="text-sm">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website, deliver advertisements on and through the website, and so on.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Controlling Cookies</h2>
            <p className="text-sm">
              You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
