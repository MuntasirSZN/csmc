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
import React from 'react'

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
          <CardDescription>Last updated: April 20, 2025</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p className="text-sm">
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. By accessing or using our website, you acknowledge that you have read, understood, and agree to be bound by all the terms of this privacy policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Collection of Your Information</h2>
            <p className="text-sm">
              We may collect information about you in a variety of ways. The information we may collect via the website includes:
            </p>
            <ul className="list-disc pl-6 mt-2 text-sm">
              <li>
                <strong>Personal Data:</strong>
                {' '}
                Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the website or when you choose to participate in various activities.
              </li>
              <li>
                <strong>Derivative Data:</strong>
                {' '}
                Information our servers automatically collect when you access the website, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the website.
              </li>
              <li>
                <strong>Financial Data:</strong>
                {' '}
                Financial information, such as data related to your payment method, that we may collect when you purchase, order, return, exchange, or request information about our services.
              </li>
              <li>
                <strong>Data From Social Networks:</strong>
                {' '}
                User information from social networking sites, such as Facebook, Instagram, Twitter, including your name, your social network username, location, gender, birth date, email address, profile picture, and public data for contacts, if you connect your account to such social networks.
              </li>
              <li>
                <strong>Mobile Device Data:</strong>
                {' '}
                Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the website from a mobile device.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. Use of Your Information</h2>
            <p className="text-sm">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the website to:
            </p>
            <ul className="list-disc pl-6 mt-2 text-sm">
              <li>Create and manage your account.</li>
              <li>Process your transactions.</li>
              <li>Send you email marketing communications.</li>
              <li>Fulfill and manage purchases, orders, payments, and other transactions related to the website.</li>
              <li>Generate a personal profile about you to make future visits to the website more personalized.</li>
              <li>Increase the efficiency and operation of the website.</li>
              <li>Monitor and analyze usage and trends to improve your experience with the website.</li>
              <li>Notify you of updates to the website.</li>
              <li>Offer new products, services, and/or recommendations to you.</li>
              <li>Perform other business activities as needed.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Disclosure of Your Information</h2>
            <p className="text-sm">
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
            </p>
            <ul className="list-disc pl-6 mt-2 text-sm">
              <li>
                <strong>By Law or to Protect Rights:</strong>
                {' '}
                If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
              </li>
              <li>
                <strong>Third-Party Service Providers:</strong>
                {' '}
                We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
              </li>
              <li>
                <strong>Marketing Communications:</strong>
                {' '}
                With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes.
              </li>
              <li>
                <strong>Interactions with Other Users:</strong>
                {' '}
                If you interact with other users of the website, those users may see your name, profile photo, and descriptions of your activity.
              </li>
              <li>
                <strong>Business Transfers:</strong>
                {' '}
                We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Cookies and Web Beacons</h2>
            <p className="text-sm">
              We may use cookies, web beacons, tracking pixels, and other tracking technologies on the website to help customize the website and improve your experience. For more information on how we use cookies, please refer to our Cookie Policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">6. Security of Your Information</h2>
            <p className="text-sm">
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
            <p className="text-sm">
              If you have questions or comments about this Privacy Policy, please contact us at privacy@example.com.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
