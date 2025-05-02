/*
 * The Terms And Conditions page. Link in footer.
 * /terms-and-conditions
 */

import type { Metadata } from 'next'
import HistoryBackButton from '@/components/history-back-button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Terms And Conditions',
  description: 'Terms and conditions at CSMC.',
}

export default function TermsAndConditions() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pt-15">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms and Conditions</CardTitle>
          <CardDescription>Last updated: April 20, 2025</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p className="text-sm">
              Welcome to our website. These Terms and Conditions govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of the terms, you do not have permission to access the website.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Intellectual Property</h2>
            <p className="text-sm">
              The content on our website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and data compilations, is the property of our company or its content suppliers and is protected by international copyright laws.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. User Accounts</h2>
            <p className="text-sm">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our website.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. User Content</h2>
            <p className="text-sm">
              Our website may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post to the website, including its legality, reliability, and appropriateness.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Prohibited Uses</h2>
            <p className="text-sm">
              You may use our website only for lawful purposes and in accordance with these Terms. You agree not to use the website for any illegal or unauthorized purpose or to violate any laws in your jurisdiction.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
            <p className="text-sm">
              In no event shall our company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the website.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">7. Changes to Terms</h2>
            <p className="text-sm">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
            <p className="text-sm">
              If you have any questions about these Terms, please contact us at support@example.com.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <HistoryBackButton />
        </CardFooter>
      </Card>
    </div>
  )
}
