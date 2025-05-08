import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

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

    // First get practice ID from slug
    const practice = await db.query.practices.findFirst({
      where: (practice, { eq }) => eq(practice.slug, slug),
    })

    if (!practice) {
      return NextResponse.json(
        { error: 'Practice not found' },
        { status: 404 },
      )
    }

    // Check if user has a completed attempt for this practice
    const attempt = await db.query.practiceAttempts.findFirst({
      where: (attempt, { and, eq, isNotNull }) => and(
        eq(attempt.userId, session.user.id),
        eq(attempt.practiceId, practice.id),
        isNotNull(attempt.completedAt),
      ),
      orderBy: (attempt, { desc }) => desc(attempt.completedAt),
    })

    return NextResponse.json({
      exists: !!attempt,
      completed: !!attempt?.completedAt,
      attemptId: attempt?.id || null,
    })
  }
  catch (error) {
    console.error('Failed to check practice attempt:', error)
    return NextResponse.json(
      { error: 'Failed to check practice attempt' },
      { status: 500 },
    )
  }
}
