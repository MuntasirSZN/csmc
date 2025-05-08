import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

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

    const attemptId = Number.parseInt(id)
    const attempt = await db.query.practiceAttempts.findFirst({
      where: (a, { eq, and }) => (
        and(
          eq(a.id, attemptId),
          eq(a.userId, session.user.id),
        )
      ),
      with: {
        practice: true,
      },
    })

    if (!attempt) {
      return NextResponse.json(
        { error: 'Attempt not found' },
        { status: 404 },
      )
    }

    // If the attempt is not completed
    if (!attempt.completedAt) {
      return NextResponse.json(
        { error: 'Attempt not completed' },
        { status: 400 },
      )
    }

    // Get questions for the practice
    const questions = await db.query.questions.findMany({
      where: (q, { eq }) => eq(q.practiceId, attempt.practiceId),
      orderBy: (q, { asc }) => asc(q.order),
    })

    // Format the response
    const response = {
      id: attempt.id,
      score: attempt.score || 0,
      totalQuestions: questions.length,
      timeSpent: attempt.timeSpent || 0,
      completedAt: attempt.completedAt,
      answers: attempt.answers || {},
      practice: {
        title: attempt.practice.title,
        slug: attempt.practice.slug,
        description: attempt.practice.description,
      },
      questions: questions.map(q => ({
        id: q.id,
        content: q.content,
        options: q.options,
        correctAnswer: q.correctAnswer,
        correctAnswers: q.correctAnswers,
        explanation: q.explanation,
        questionType: q.questionType || 'option',
        answerType: q.answerType || 'single',
      })),
    }

    return NextResponse.json(response)
  }
  catch (error) {
    console.error('Failed to fetch practice attempt results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch practice attempt results' },
      { status: 500 },
    )
  }
}
