/*
 * Main Handler for practice page
 */

import type { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { practiceAttempts } from '@/lib/schema'

export async function POST(request: NextRequest) {
  try {
    const session = await await auth.api.getSession({
      headers: await headers(),
    })
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const { practiceId } = await request.json()

    if (!practiceId) {
      return NextResponse.json(
        { error: 'Practice ID is required' },
        { status: 400 },
      )
    }

    const [attempt] = await db.insert(practiceAttempts)
      .values({
        userId: session.user.id,
        practiceId,
        startedAt: new Date(),
      })
      .returning()

    return NextResponse.json(attempt)
  }
  catch (error) {
    console.error('Failed to create practice attempt:', error)
    return NextResponse.json(
      { error: 'Failed to create practice attempt' },
      { status: 500 },
    )
  }
}
