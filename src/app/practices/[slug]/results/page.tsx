'use client'

import { rehypePlugins, remarkPlugins } from '@/components/markdown-plugins'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatDuration } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import Markdown from 'react-markdown'

import { toast } from 'sonner'

interface Question {
  id: number
  content: string
  options: string[]
  correctAnswer: string
  order: number
}

interface Practice {
  id: number
  title: string
  description: string | null
  questions: Question[]
}

interface AttemptResult {
  id: number
  practiceId: number
  startedAt: string
  completedAt: string
  timeSpent: number
  score: number
  answers: Record<number, string>
  practice: Practice
}

export default function ResultsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const attemptId = searchParams.get('attemptId')

  const [result, setResult] = useState<AttemptResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!attemptId) {
      toast.error('Missing attempt ID')
      router.push(`/practices/${slug}`)
      return
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/practice-attempts/${attemptId}/result`)
        if (!response.ok) {
          throw new Error('Failed to fetch results')
        }
        const data = await response.json()
        setResult(data)
      }
      catch (error) {
        console.error('Error fetching results:', error)
        toast.error('Failed to load practice results')
      }
      finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [attemptId, slug, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!result) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Results not found</h1>
        <p>We couldn't find the results for this attempt.</p>
        <Button className="mt-4" onClick={() => router.push('/practices')}>
          Return to Practice List
        </Button>
      </div>
    )
  }

  const totalQuestions = result.practice.questions.length
  const correctAnswers = result.score || 0
  const scorePercentage = (correctAnswers / totalQuestions) * 100

  return (
    <div className="container py-6 pt-15 text-center mx-auto">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            {result.practice.title}
            {' '}
            - Results
          </h1>
          {result.practice.description && (
            <p className="text-muted-foreground mt-1">{result.practice.description}</p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Practice Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-muted-foreground text-sm">Score</div>
                <div className="text-2xl font-bold">
                  {correctAnswers}
                  {' '}
                  /
                  {' '}
                  {totalQuestions}
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-muted-foreground text-sm">Time Spent</div>
                <div className="text-2xl font-bold">{formatDuration(result.timeSpent)}</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-muted-foreground text-sm">Completed</div>
                <div className="text-2xl font-bold">
                  {new Date(result.completedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span>
                  Score:
                  {scorePercentage.toFixed(1)}
                  %
                </span>
                <span>
                  {correctAnswers}
                  {' '}
                  of
                  {' '}
                  {totalQuestions}
                  {' '}
                  correct
                </span>
              </div>
              <Progress
                value={scorePercentage}
                className={`h-3 ${
                  scorePercentage >= 70
                    ? 'bg-green-500'
                    : scorePercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <h2 className="text-xl font-bold mt-6">Question Review</h2>

        {result.practice.questions
          .sort((a, b) => a.order - b.order)
          .map((question) => {
            const userAnswer = result.answers[question.id] || 'Not answered'
            const isCorrect = userAnswer === question.correctAnswer

            return (
              <Card
                key={question.id}
                className={`mb-4 border-l-4 ${
                  isCorrect ? 'border-l-green-500' : 'border-l-red-500'
                }`}
              >
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
                      {question.content}
                    </Markdown>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Your Answer:</p>
                      <div className={`p-3 rounded-md ${
                        userAnswer === 'Not answered'
                          ? 'bg-muted'
                          : isCorrect
                            ? 'bg-green-500/10 border border-green-500'
                            : 'bg-red-500/10 border border-red-500'
                      }`}
                      >
                        {userAnswer === 'Not answered'
                          ? (
                              <span className="text-muted-foreground">Not answered</span>
                            )
                          : (
                              <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>{userAnswer}</Markdown>
                            )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Correct Answer:</p>
                      <div className="p-3 bg-green-500/10 border border-green-500 rounded-md">
                        <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>{question.correctAnswer}</Markdown>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => router.push('/practices')}>
            Return to Practice List
          </Button>
          <Button onClick={() => router.push(`/practices/${slug}`)}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}
