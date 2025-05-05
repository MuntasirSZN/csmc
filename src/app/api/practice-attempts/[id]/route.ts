/*
 * Attempts handler for practice page
 */

import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { practiceAttempts } from '@/lib/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PUT(
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

    const existingAttempt = await db.query.practiceAttempts.findFirst({
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

    if (!existingAttempt) {
      return NextResponse.json(
        { error: 'Practice attempt not found' },
        { status: 404 },
      )
    }

    const { answers, timeSpent } = await request.json()

    let score = 0
    if (existingAttempt.practice?.questions && answers) {
      for (const question of existingAttempt.practice.questions) {
        if (answers[question.id] === question.correctAnswer) {
          score++
        }
      }
    }

    const [updatedAttempt] = await db
      .update(practiceAttempts)
      .set({
        completedAt: new Date(),
        timeSpent,
        score,
        answers,
      })
      .where(eq(practiceAttempts.id, attemptId))
      .returning()

    return NextResponse.json(updatedAttempt)
  }
  catch (error) {
    console.error('Failed to update practice attempt:', error)
    return NextResponse.json(
      { error: 'Failed to update practice attempt' },
      { status: 500 },
    )
  }
}
