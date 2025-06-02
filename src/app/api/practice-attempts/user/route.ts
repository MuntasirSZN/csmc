import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
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

    const userAttempts = await db.query.practiceAttempts.findMany({
      where: (attempt, { eq }) => eq(attempt.userId, session.user.id),
      orderBy: (attempt, { desc }) => desc(attempt.startedAt),
    })

    return NextResponse.json(userAttempts)
  }
  catch (error) {
    console.error('Failed to fetch user attempts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user attempts' },
      { status: 500 },
    )
  }
}
