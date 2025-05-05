/*
 * Result handler of practice page
 */

import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { practiceAttempts } from '@/lib/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const { id } = await params
    const attemptId = Number.parseInt(id, 10)

    const attempt = await db.query.practiceAttempts.findFirst({
      where: and(
        eq(practiceAttempts.id, attemptId),
        eq(practiceAttempts.userId, session.user.id),
      ),
      with: {
        practice: {
          with: {
            questions: true,
          },
        },
      },
    })

    if (!attempt) {
      return NextResponse.json(
        { error: 'Practice attempt not found' },
        { status: 404 },
      )
    }

    if (!attempt.completedAt) {
      return NextResponse.json(
        { error: 'Practice attempt has not been completed' },
        { status: 400 },
      )
    }

    return NextResponse.json(attempt)
  }
  catch (error) {
    console.error('Failed to fetch practice attempt result:', error)
    return NextResponse.json(
      { error: 'Failed to fetch practice attempt result' },
      { status: 500 },
    )
  }
}
