/*
 * The /contact pages route to accept contact requests.
 */

import type { NextRequest } from 'next/server'
import arcjet, { tokenBucket, validateEmail } from '@arcjet/next'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { ContactSubmissions } from '@/lib/schema'

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ['ip.src'],
  rules: [
    validateEmail({
      mode: 'LIVE',
      deny: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
    }),
    tokenBucket({
      mode: 'LIVE',
      refillRate: 10,
      interval: 60,
      capacity: 100,
    }),
  ],
})

const contactFormSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = contactFormSchema.safeParse(body)

    if (!result.success) {
      const formattedErrors: Record<string, string> = {}
      const errors = result.error.format()

      Object.keys(errors).forEach((key) => {
        if (key !== '_errors' && key in errors) {
          const fieldErrors = errors[key as keyof typeof errors]
          // Fix: Check if fieldErrors is an object and has the _errors property
          if (fieldErrors
            && typeof fieldErrors === 'object'
            && '_errors' in fieldErrors
            && Array.isArray(fieldErrors._errors)
            && fieldErrors._errors.length > 0) {
            formattedErrors[key] = fieldErrors._errors[0]
          }
        }
      })

      return NextResponse.json(
        {
          message: 'Validation failed',
          errors: formattedErrors,
        },
        { status: 400 },
      )
    }

    const { firstName, lastName, email, message } = result.data

    const decision = await aj.protect(request, { requested: 1, email })

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { error: 'Too Many Requests', reason: decision.reason },
          { status: 429 },
        )
      }
      else if (decision.reason.isEmail()) {
        return NextResponse.json(
          { error: 'Invalid Email', reason: decision.reason },
          { status: 400 },
        )
      }
    }

    const existingSubmission = await db
      .select()
      .from(ContactSubmissions)
      .where(eq(ContactSubmissions.email, email))

    if (existingSubmission.length > 0) {
      return NextResponse.json(
        { message: 'This email has already submitted a contact form.' },
        { status: 409 },
      )
    }

    const insertResult = await db
      .insert(ContactSubmissions)
      .values({
        firstName,
        lastName,
        email,
        message,
      })
      .returning({ id: ContactSubmissions.id })

    const insertId = insertResult[0]?.id || null

    return NextResponse.json({
      message: 'Form submitted successfully',
      id: insertId,
    })
  }
  catch (error) {
    console.error('Error submitting contact form:', error)

    return NextResponse.json(
      { message: 'Error submitting form. Please try again later.' },
      { status: 500 },
    )
  }
}
