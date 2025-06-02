import type { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

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

    // Check if the attempt exists and belongs to the current user
    const attempt = await db.query.practiceAttempts.findFirst({
      where: (a, { and, eq }) => and(
        eq(a.id, attemptId),
        eq(a.userId, session.user.id),
      ),
    })

    return NextResponse.json({
      exists: !!attempt,
      completed: attempt?.completedAt !== null,
    })
  }
  catch (error) {
    console.error('Failed to verify practice attempt:', error)
    return NextResponse.json(
      { error: 'Failed to verify practice attempt' },
      { status: 500 },
    )
  }
}
