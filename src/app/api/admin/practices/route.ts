import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { practices, questions } from '@/lib/schema'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const data = await request.json()
    const { title, slug, description, content, timeLimit, questions: questionList } = data

    if (!title || !slug || !timeLimit || !Array.isArray(questionList) || questionList.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const existingPractice = await db.query.practices.findFirst({
      where: (practice, { eq }) => eq(practice.slug, slug),
    })

    if (existingPractice) {
      return NextResponse.json(
        { error: 'A practice with this title already exists' },
        { status: 409 },
      )
    }

    const [practice] = await db.insert(practices).values({
      title,
      slug,
      description,
      content,
      timeLimit,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    for (const q of questionList) {
      await db.insert(questions).values({
        practiceId: practice.id,
        content: q.content,
        options: q.options,
        correctAnswer: q.correctAnswer,
        order: q.order,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    return NextResponse.json(practice)
  }
  catch (error) {
    console.error('Failed to create practice:', error)
    return NextResponse.json(
      { error: 'Failed to create practice' },
      { status: 500 },
    )
  }
}
