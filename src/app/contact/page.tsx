/*
 * The /contact page resides here.
 */

import type { Metadata } from 'next'
import ContactForm from '@/components/contact-form'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Mail, MapPinIcon, PhoneIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with us for any inqueries or feedback.',
}

export default function ContactPage() {
  return (
    <div className="container py-12 pt-25 mx-auto">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Get in Touch</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Have a question or want to work together? Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="overflow-hidden">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-medium">Email</h3>
              <p className="text-sm text-muted-foreground">csmc24.24@gmail.com</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <PhoneIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-medium">Phone</h3>
              <p className="text-sm text-muted-foreground">031-2863055</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <MapPinIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-medium">Office</h3>
              <p className="text-sm text-muted-foreground">Ice Factory Road, Sadarghat, Chattogram, Bangladesh</p>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden border-none shadow-lg">
          <CardContent className="p-5">
            <div className="grid md:grid-cols-2">
              <div className="bg-muted p-8 md:p-10 rounded-sm">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight">Contact Form</h2>
                  <p className="text-muted-foreground">
                    Fill out the form and we'll get back to you within 24 hours.
                  </p>
                </div>
              </div>
              <div className="p-8 md:p-10">
                <ContactForm />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
