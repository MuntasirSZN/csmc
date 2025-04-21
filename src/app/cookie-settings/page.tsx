'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { CookieIcon } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function CookiePolicy() {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always enabled
    functional: true,
    analytics: true,
    marketing: false,
  })

  const handleToggle = (cookieType: string) => {
    if (cookieType === 'necessary')
      return // Can't toggle necessary cookies
    setCookiePreferences({
      ...cookiePreferences,
      [cookieType]: !cookiePreferences[cookieType],
    })
  }

  const handleSavePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences))
    toast.success('Your cookie preferences have been saved.')
  }

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

            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Necessary Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    These cookies are essential for the website to function properly. They cannot be disabled.
                  </p>
                </div>
                <Switch
                  checked={cookiePreferences.necessary}
                  disabled={true} // Necessary cookies can't be toggled
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Functional Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    These cookies enable the website to provide enhanced functionality and personalization.
                  </p>
                </div>
                <Switch
                  checked={cookiePreferences.functional}
                  onCheckedChange={() => handleToggle('functional')}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Analytics Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>
                <Switch
                  checked={cookiePreferences.analytics}
                  onCheckedChange={() => handleToggle('analytics')}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Marketing Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging.
                  </p>
                </div>
                <Switch
                  checked={cookiePreferences.marketing}
                  onCheckedChange={() => handleToggle('marketing')}
                />
              </div>
            </div>
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

        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
          <Button onClick={handleSavePreferences}>
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
