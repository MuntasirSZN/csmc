'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

export default function CookiePreferencesForm() {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always enabled
    functional: true,
    analytics: true,
    marketing: false,
  })

  type CookieType = keyof typeof cookiePreferences

  const handleToggle = (cookieType: CookieType) => {
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
    <>
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

      <div className="flex justify-between border-t pt-4 mt-6">
        <Button variant="outline" onClick={() => window.history.back()} className="cursor-pointer">
          Back
        </Button>
        <Button onClick={handleSavePreferences} className="cursor-pointer">
          Save Preferences
        </Button>
      </div>
    </>
  )
}
