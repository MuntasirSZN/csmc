'use client'

import GoogleAnalytics from '@/components/GoogleAnalytics'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CircleCheck, CircleSlash, CookieIcon, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always enabled
    functional: true,
    analytics: true,
    marketing: false,
  })

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    const savedPreferences = localStorage.getItem('cookiePreferences')

    if (consent === 'true') {
      setConsentGiven(true)
      if (savedPreferences) {
        setCookiePreferences(JSON.parse(savedPreferences))
      }
    }
    else if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true')
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences))
    setConsentGiven(true)
    setIsVisible(false)
  }

  const handleDecline = () => {
    const declinedPreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    }
    localStorage.setItem('cookieConsent', 'false')
    localStorage.setItem('cookiePreferences', JSON.stringify(declinedPreferences))
    setCookiePreferences(declinedPreferences)
    setConsentGiven(false)
    setIsVisible(false)
    window.location.reload()
  }

  const handleCustomize = () => {
    setShowPreferences(true)
  }

  const handleToggle = (cookieType: boolean) => {
    if (cookieType === 'necessary')
      return // Can't toggle necessary cookies
    setCookiePreferences({
      ...cookiePreferences,
      [cookieType]: !cookiePreferences[cookieType],
    })
  }

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', 'true')
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences))
    setConsentGiven(true)
    setIsVisible(false)
    setShowPreferences(false)
  }

  return (
    <>
      <AnimatePresence>
        {isVisible && !showPreferences && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed right-4 bottom-4 left-4 z-50 md:right-4 md:left-auto md:w-96"
          >
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <CookieIcon size={20} />
                    <span>We Use Cookies</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVisible(false)}
                    className="h-8 w-8"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-left text-sm">
                <p>
                  We use cookies to enhance your browsing experience, serve
                  personalized ads or content, and analyze our traffic. By
                  clicking &quot;Accept&quot;, you consent to our use of
                  cookies. Please refer to the links in our footer for our Terms and Conditions,
                  Privacy Policy, and Cookie Policy.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCustomize}
                  className="cursor-pointer"
                >
                  Customize
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDecline}
                    className="cursor-pointer bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-100 border-none"
                  >
                    <CircleSlash size={16} className="mr-1" />
                    <span>Decline</span>
                  </Button>
                  <Button
                    className="cursor-pointer bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-100 border-none"
                    size="sm"
                    onClick={handleAccept}
                  >
                    <CircleCheck size={16} className="mr-1" />
                    <span>Accept</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {isVisible && showPreferences && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <Card className="shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <CookieIcon size={20} />
                    <span>Cookie Preferences</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPreferences(false)}
                    className="h-8 w-8"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-left space-y-4">
                <p className="text-sm">
                  Customize your cookie preferences below. Necessary cookies are always enabled as they are essential for the website to function properly.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium text-sm">Necessary Cookies</h3>
                      <p className="text-xs text-muted-foreground">
                        Essential for the website to function properly.
                      </p>
                    </div>
                    <div className="flex items-center h-4">
                      <span className="text-xs mr-2 text-muted-foreground">Always on</span>
                      <div className="w-8 h-4 bg-primary rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium text-sm">Functional Cookies</h3>
                      <p className="text-xs text-muted-foreground">
                        Enable enhanced functionality and personalization.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleToggle('functional')}
                      >
                        {cookiePreferences.functional ? 'Enabled' : 'Disabled'}
                      </Button>
                      <div
                        className={`w-8 h-4 rounded-full cursor-pointer ${cookiePreferences.functional ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                        onClick={() => handleToggle('functional')}
                      >
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium text-sm">Analytics Cookies</h3>
                      <p className="text-xs text-muted-foreground">
                        Help understand how you interact with our website.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleToggle('analytics')}
                      >
                        {cookiePreferences.analytics ? 'Enabled' : 'Disabled'}
                      </Button>
                      <div
                        className={`w-8 h-4 rounded-full cursor-pointer ${cookiePreferences.analytics ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                        onClick={() => handleToggle('analytics')}
                      >
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium text-sm">Marketing Cookies</h3>
                      <p className="text-xs text-muted-foreground">
                        Used to display relevant and engaging ads.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleToggle('marketing')}
                      >
                        {cookiePreferences.marketing ? 'Enabled' : 'Disabled'}
                      </Button>
                      <div
                        className={`w-8 h-4 rounded-full cursor-pointer ${cookiePreferences.marketing ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                        onClick={() => handleToggle('marketing')}
                      >
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  For more details, please check the Cookie Policy, Privacy Policy, and Terms and Conditions links in our footer.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreferences(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSavePreferences}
                  className="bg-primary hover:bg-primary/90"
                >
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <GoogleAnalytics consentGiven={consentGiven && cookiePreferences.analytics} />
    </>
  )
}
