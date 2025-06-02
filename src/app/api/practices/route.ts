/*
 * Get Practices
 */

import { desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { practices } from '@/lib/schema'

export async function GET() {
  try {
    const practicesList = await db.query.practices.findMany({
      orderBy: [desc(practices.createdAt)],
    })

    return NextResponse.json(practicesList)
  }
  catch (error) {
    console.error('Failed to fetch practices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch practices' },
      { status: 500 },
    )
  }
}
