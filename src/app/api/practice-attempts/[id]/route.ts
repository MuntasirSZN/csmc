import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { practiceAttempts } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { unauthorized } from 'next/navigation'
import { NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const attemptId = Number.parseInt(id)

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return unauthorized()
  }

  try {
    const { answers, timeSpent } = await request.json()

    const attempt = await db.query.practiceAttempts.findFirst({
      where: attempt => eq(attempt.id, attemptId),
    })

    if (!attempt) {
      return NextResponse.json(
        { error: 'Attempt not found' },
        { status: 404 },
      )
    }

    if (attempt.userId !== session.user.id) {
      return unauthorized()
    }

    // Get practice questions with correct answers
    const practiceQuestions = await db.query.questions.findMany({
      where: question => eq(question.practiceId, attempt.practiceId),
    })

    // Calculate score
    let score = 0

    for (const question of practiceQuestions) {
      const userAnswer = answers[question.id]

      // Skip questions with no answer
      if (!userAnswer)
        continue

      if (question.questionType === 'text') {
        // For text questions, we'll need manual grading, so skip scoring
        continue
      }
      else {
        // For option questions
        if (question.answerType === 'single') {
          // Single answer
          if (userAnswer === question.correctAnswer) {
            score += 1
          }
        }
        else {
          // Multiple answers
          const correctAnswersSet = new Set(question.correctAnswers || [])
          const userAnswersSet = new Set(Array.isArray(userAnswer) ? userAnswer : [userAnswer])

          // Check if sets are equal
          if (correctAnswersSet.size === userAnswersSet.size
            && [...correctAnswersSet].every(value => userAnswersSet.has(value))) {
            score += 1
          }
        }
      }
    }

    // Update attempt
    await db.update(practiceAttempts)
      .set({
        completedAt: new Date(),
        timeSpent,
        answers,
        score,
      })
      .where(eq(practiceAttempts.id, attemptId))

    return NextResponse.json({ success: true })
  }
  catch (error) {
    console.error('Failed to update practice attempt:', error)
    return NextResponse.json(
      { error: 'Failed to update practice attempt' },
      { status: 500 },
    )
  }
}
