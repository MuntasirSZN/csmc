/*
 * The newsletter part of footers route. Accepts newsletter requests.
 */

import { db } from '@/lib/db'
import { NewsletterSubscriptions } from '@/lib/schema'
import arcjet, { tokenBucket, validateEmail } from '@arcjet/next'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ['ip.src'],
  rules: [
    tokenBucket({
      mode: 'LIVE',
      refillRate: 10,
      interval: 60,
      capacity: 100,
    }),
    validateEmail({
      mode: 'LIVE',
      deny: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
    }),
  ],
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Valid email is required.' },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address.' },
        { status: 400 },
      )
    }

    const decision = await aj.protect(request, { requested: 1, email })

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { message: 'Too many subscription attempts. Please try again later.' },
          { status: 429 },
        )
      }
      else if (decision.reason.isEmail()) {
        return NextResponse.json(
          { message: 'Please provide a valid email address from a non-disposable domain.' },
          { status: 400 },
        )
      }
      else {
        return NextResponse.json(
          { message: 'Your subscription request was denied.', reason: decision.reason },
          { status: 429 },
        )
      }
    }

    const existingSubscription = await db
      .select()
      .from(NewsletterSubscriptions)
      .where(eq(NewsletterSubscriptions.email, email.toLowerCase().trim()))

    if (existingSubscription.length > 0) {
      return NextResponse.json(
        { message: 'This email is already subscribed to the newsletter.' },
        { status: 409 },
      )
    }

    const result = await db
      .insert(NewsletterSubscriptions)
      .values({
        email: email.toLowerCase().trim(),
      })
      .returning({ id: NewsletterSubscriptions.id })

    const insertId = result[0]?.id || null

    return NextResponse.json({
      message: 'You have successfully subscribed to our newsletter!',
      id: insertId,
    })
  }
  catch (error) {
    console.error('Error subscribing to newsletter:', error)

    return NextResponse.json(
      { message: 'Error subscribing to newsletter. Please try again later.' },
      { status: 500 },
    )
  }
}
