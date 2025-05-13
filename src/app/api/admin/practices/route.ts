import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { practices, questions } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

// Create a new practice
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
        { error: 'A practice with this slug already exists' },
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
        correctAnswers: q.correctAnswers,
        explanation: q.explanation,
        questionType: q.questionType,
        answerType: q.answerType,
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

// Get all practices or a single practice
export async function GET(request: NextRequest) {
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

    const url = new URL(request.url)
    const slug = url.searchParams.get('slug')

    if (slug) {
      const practice = await db.query.practices.findFirst({
        where: (practice, { eq }) => eq(practice.slug, slug),
      })

      if (!practice) {
        return NextResponse.json(
          { error: 'Practice not found' },
          { status: 404 },
        )
      }

      const practiceQuestions = await db.query.questions.findMany({
        where: (question, { eq }) => eq(question.practiceId, practice.id),
        orderBy: (question, { asc }) => asc(question.order),
      })

      return NextResponse.json({
        ...practice,
        questions: practiceQuestions,
      })
    }

    const allPractices = await db.query.practices.findMany({
      orderBy: (practice, { desc }) => desc(practice.updatedAt),
    })

    return NextResponse.json(allPractices)
  }
  catch (error) {
    console.error('Failed to fetch practices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch practices' },
      { status: 500 },
    )
  }
}

// Update a practice
export async function PUT(request: NextRequest) {
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
    const { id, title, slug, description, content, timeLimit, questions: questionList } = data

    if (!id || !title || !slug || !timeLimit || !Array.isArray(questionList) || questionList.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Check if practice exists
    const existingPractice = await db.query.practices.findFirst({
      where: (practice, { eq }) => eq(practice.id, id),
    })

    if (!existingPractice) {
      return NextResponse.json(
        { error: 'Practice not found' },
        { status: 404 },
      )
    }

    // Check if slug is unique (if changed)
    if (slug !== existingPractice.slug) {
      const slugExists = await db.query.practices.findFirst({
        where: (practice, { eq }) => eq(practice.slug, slug),
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'A practice with this slug already exists' },
          { status: 409 },
        )
      }
    }

    const [updatedPractice] = await db.update(practices)
      .set({
        title,
        slug,
        description,
        content,
        timeLimit,
        updatedAt: new Date(),
      })
      .where(eq(practices.id, id))
      .returning()

    await db.delete(questions).where(eq(questions.practiceId, id))

    for (const q of questionList) {
      await db.insert(questions).values({
        practiceId: id,
        content: q.content,
        options: q.options,
        correctAnswer: q.correctAnswer,
        correctAnswers: q.correctAnswers,
        explanation: q.explanation,
        questionType: q.questionType,
        answerType: q.answerType,
        order: q.order,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    return NextResponse.json(updatedPractice)
  }
  catch (error) {
    console.error('Failed to update practice:', error)
    return NextResponse.json(
      { error: 'Failed to update practice' },
      { status: 500 },
    )
  }
}

// Delete a practice
export async function DELETE(request: NextRequest) {
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

    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Practice ID is required' },
        { status: 400 },
      )
    }

    const existingPractice = await db.query.practices.findFirst({
      where: (practice, { eq }) => eq(practice.id, Number.parseInt(id)),
    })

    if (!existingPractice) {
      return NextResponse.json(
        { error: 'Practice not found' },
        { status: 404 },
      )
    }

    await db.delete(practices).where(eq(practices.id, Number.parseInt(id)))

    return NextResponse.json({ success: true })
  }
  catch (error) {
    console.error('Failed to delete practice:', error)
    return NextResponse.json(
      { error: 'Failed to delete practice' },
      { status: 500 },
    )
  }
}
