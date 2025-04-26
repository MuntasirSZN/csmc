'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, MapPinIcon, PhoneIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  message?: string
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    toast.promise(
      fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then(async (response) => {
          const data = await response.json()

          if (!response.ok) {
            if (response.status === 400 && data.errors) {
              setErrors(data.errors)
              throw new Error(data.message || 'Validation failed')
            }
            throw new Error(data.message || 'Something went wrong')
          }

          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            message: '',
          })

          return data
        }),
      {
        loading: 'Submitting your message...',
        success: 'Thank you! Your message has been sent successfully.',
        error: error => `${error.message}`,
      },
    )
    setIsSubmitting(false)
  }

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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        aria-invalid={!!errors.firstName}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive">{errors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        aria-invalid={!!errors.lastName}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      aria-invalid={!!errors.email}
                    />
                    <p className="text-sm text-muted-foreground">
                      We'll never share your email with anyone else.
                    </p>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Type your message here..."
                      className="min-h-32 resize-none"
                      value={formData.message}
                      onChange={handleChange}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">{errors.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
