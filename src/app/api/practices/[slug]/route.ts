/*
 * Id based handler
 */

import type { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { practices } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  try {
    const practice = await db.query.practices.findFirst({
      where: eq(practices.slug, slug),
      with: {
        questions: {
          orderBy: (questions, { asc }) => [asc(questions.order)],
          columns: {
            correctAnswer: false, // Don't send correct answers to client
          },
        },
      },
    })

    if (!practice) {
      return NextResponse.json(
        { error: 'Practice not found' },
        { status: 404 },
      )
    }

    return NextResponse.json(practice)
  }
  catch (error) {
    console.error('Failed to fetch practice:', error)
    return NextResponse.json(
      { error: 'Failed to fetch practice' },
      { status: 500 },
    )
  }
}
