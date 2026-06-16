'use client'

import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { safeFetch } from '@/lib/fetch-utils'
import { QuestionReviewList } from './question-review-list'
import { ResultsSummary } from './results-summary'

interface Question {
  id: number
  content: string
  options?: string[]
  correctAnswer?: string
  correctAnswers?: string[]
  explanation?: string
  questionType: 'option' | 'text'
  answerType: 'single' | 'multiple'
}

interface PracticeAttempt {
  id: number
  score: number
  totalQuestions: number
  timeSpent: number
  completedAt: string
  answers: Record<number, string | string[]>
  practice: {
    title: string
    slug: string
    description: string | null
  }
  questions: Question[]
}

export default function ResultsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const searchParams = useSearchParams()
  const attemptId = searchParams.get('attemptId')

  const [attemptResult, setAttemptResult] = useState<PracticeAttempt | null>(null)
  const loading = attemptResult === null
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)

  /* eslint-disable react-you-might-not-need-an-effect/no-external-store-subscription -- data fetching pattern */
  useEffect(() => {
    if (!attemptId) {
      toast.error('No attempt ID provided', {
        description: 'Unable to load results without an attempt ID',
      })
      window.location.href = '/practices'
      return
    }

    let ignore = false
    const fetchResults = async () => {
      const { data, error } = await safeFetch(`/api/practice-attempts/${attemptId}/results`)
      if (error) {
        if (!ignore) {
          toast.error('Failed to load results', {
            description: error.message || 'An unexpected error occurred',
          })
        }
        if (!ignore)
          window.location.href = '/practices'
        return
      }
      if (!ignore)
        setAttemptResult(data)
    }
    fetchResults()
    return () => {
      ignore = true
    }
  }, [attemptId])
  /* eslint-enable react-you-might-not-need-an-effect/no-external-store-subscription */

  if (loading) {
    return (
      <div className="container py-8 mx-auto max-w-3xl">
        <div className="space-y-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!attemptResult) {
    return (
      <div className="container py-8 mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Results not found</h1>
          <p className="mb-6">We couldn't find the results for this attempt.</p>
          <Button render={<Link href="/practices" />} nativeButton={false}>Return to Practices</Button>
        </div>
      </div>
    )
  }

  const { score, totalQuestions, timeSpent, completedAt, practice, questions, answers } = attemptResult
  const percentageScore = (score / totalQuestions) * 100

  // Navigate between questions
  const goToNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1)
    }
  }

  const goToPrevQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(prev => prev - 1)
    }
  }

  return (
    <div className="container py-8 mx-auto max-w-3xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {practice.title}
            {' '}
            - Results
          </h1>
          {practice.description && (
            <p className="text-muted-foreground mt-1">{practice.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            Completed
            {' '}
            {formatDistanceToNow(new Date(completedAt), { addSuffix: true })}
          </p>
        </div>

        <ResultsSummary
          score={score}
          totalQuestions={totalQuestions}
          timeSpent={timeSpent}
          percentageScore={percentageScore}
        />

        <QuestionReviewList
          questions={questions}
          answers={answers}
          activeQuestionIndex={activeQuestionIndex}
          onNext={goToNextQuestion}
          onPrev={goToPrevQuestion}
        />

        <div className="flex justify-center gap-4">
          <Button variant="outline" render={<Link href={`/practices/${slug}`} />} nativeButton={false}>
            Try Again
          </Button>
          <Button render={<Link href="/practices" />} nativeButton={false}>
            All Practices
          </Button>
        </div>
      </div>
    </div>
  )
}
