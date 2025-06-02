'use client'

import { formatDistanceToNow } from 'date-fns'
import { BarChart2, CheckCircle2, Clock, Home, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { toast } from 'sonner'
import { ExplanationCallout } from '@/components/explanation-callout'
import { rehypePlugins, remarkPlugins } from '@/components/markdown-plugins'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

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
  const router = useRouter()
  const searchParams = useSearchParams()
  const attemptId = searchParams.get('attemptId')

  const [attemptResult, setAttemptResult] = useState<PracticeAttempt | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)

  useEffect(() => {
    if (!attemptId) {
      toast.error('No attempt ID provided', {
        description: 'Unable to load results without an attempt ID',
      })
      router.push('/practices')
      return
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/practice-attempts/${attemptId}/results`)

        if (!response.ok) {
          throw new Error('Failed to fetch results')
        }

        const data = await response.json()
        setAttemptResult(data)
      }
      catch (error: any) {
        toast.error('Failed to load results', {
          description: error.message || 'An unexpected error occurred',
        })
        router.push('/practices')
      }
      finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [attemptId, router])

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
          <Button asChild>
            <Link href="/practices">Return to Practices</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { score, totalQuestions, timeSpent, completedAt, practice, questions, answers } = attemptResult
  const percentageScore = (score / totalQuestions) * 100
  const currentQuestion = questions[activeQuestionIndex]
  const userAnswer = answers[currentQuestion.id]

  // Check if the user's answer is correct
  const isCorrect = (() => {
    if (currentQuestion.questionType === 'option') {
      if (currentQuestion.answerType === 'single') {
        return userAnswer === currentQuestion.correctAnswer
      }
      else {
        const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer]
        return (
          currentQuestion.correctAnswers
          && userAnswerArray.length === currentQuestion.correctAnswers.length
          && userAnswerArray.every(answer => currentQuestion.correctAnswers?.includes(answer))
        )
      }
    }
    else {
      // For text questions
      if (!userAnswer)
        return false
      return currentQuestion.correctAnswers?.includes(userAnswer.toString())
    }
  })()

  // Format time spent
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

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

        {/* Score Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-center">Your Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold text-primary">
                {score}
                {' '}
                /
                {totalQuestions}
                {' '}
                (
                {percentageScore.toFixed(0)}
                %)
              </div>
            </div>
            <Progress value={percentageScore} className="h-3" />
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                <div className="flex items-center text-xl font-semibold">
                  <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                  {score}
                  {' '}
                  /
                  {totalQuestions}
                </div>
                <p className="text-sm text-muted-foreground">Score</p>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                <div className="flex items-center text-xl font-semibold">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  {formatTime(timeSpent)}
                </div>
                <p className="text-sm text-muted-foreground">Time Spent</p>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                <div className="flex items-center text-xl font-semibold">
                  {percentageScore >= 70
                    ? (
                        <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                      )
                    : (
                        <XCircle className="mr-2 h-5 w-5 text-red-500" />
                      )}
                  {percentageScore >= 70 ? 'Passed' : 'Try Again'}
                </div>
                <p className="text-sm text-muted-foreground">
                  {percentageScore >= 70 ? 'Well done!' : 'Keep practicing'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Question Review</span>
              <span className="text-sm font-medium">
                {activeQuestionIndex + 1}
                {' '}
                of
                {questions.length}
              </span>
            </CardTitle>
            <Progress
              value={((activeQuestionIndex + 1) / questions.length) * 100}
              className="h-2"
            />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question content */}
            <div className="space-y-4">
              <div className="text-left">
                <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
                  {currentQuestion.content}
                </Markdown>
              </div>

              {/* Multiple choice answers */}
              {currentQuestion.questionType === 'option' && currentQuestion.options && (
                <div className="space-y-3 mt-4">
                  {currentQuestion.options.map((option, i) => {
                    const isUserSelected = currentQuestion.answerType === 'single'
                      ? userAnswer === option
                      : Array.isArray(userAnswer) && userAnswer.includes(option)

                    const isCorrectOption = currentQuestion.answerType === 'single'
                      ? currentQuestion.correctAnswer === option
                      : currentQuestion.correctAnswers?.includes(option)

                    let optionClass = 'border p-3 rounded-md'

                    if (isUserSelected && isCorrectOption) {
                      optionClass += ' border-green-500 bg-green-50 dark:bg-green-900/20'
                    }
                    else if (isUserSelected && !isCorrectOption) {
                      optionClass += ' border-red-500 bg-red-50 dark:bg-red-900/20'
                    }
                    else if (!isUserSelected && isCorrectOption) {
                      optionClass += ' border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    }

                    return (
                      <div key={i} className={optionClass}>
                        <div className="flex items-start">
                          <div className="mr-3 text-sm font-medium text-muted-foreground">
                            {String.fromCharCode(65 + i)}
                            .
                          </div>
                          <div className="flex-1">
                            <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
                              {option}
                            </Markdown>
                          </div>
                          <div className="flex-shrink-0 ml-2">
                            {isUserSelected && isCorrectOption && (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            )}
                            {isUserSelected && !isCorrectOption && (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            {!isUserSelected && isCorrectOption && (
                              <CheckCircle2 className="h-5 w-5 text-yellow-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Text input answers */}
              {currentQuestion.questionType === 'text' && (
                <div className="space-y-4 mt-4">
                  <div className="border p-4 rounded-md">
                    <div className="text-sm font-medium mb-2">Your Answer:</div>
                    <div className={`p-2 rounded-md ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20' : 'bg-red-50 border-red-200 dark:bg-red-900/20'}`}>
                      {userAnswer ? userAnswer.toString() : 'No answer provided'}
                    </div>
                    {!isCorrect && (
                      <div className="mt-4">
                        <div className="text-sm font-medium mb-2">Acceptable Answers:</div>
                        <div className="p-2 bg-yellow-50 border-yellow-200 rounded-md dark:bg-yellow-900/20">
                          <ul className="list-disc pl-4 space-y-1">
                            {currentQuestion.correctAnswers?.map((answer, idx) => (
                              <li key={idx}>{answer}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Explanation */}
              {currentQuestion.explanation && (
                <div className="mt-6">
                  <ExplanationCallout explanation={currentQuestion.explanation} />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <Button
              variant="outline"
              onClick={goToPrevQuestion}
              disabled={activeQuestionIndex === 0}
            >
              Previous Question
            </Button>

            {activeQuestionIndex < questions.length - 1
              ? (
                  <Button onClick={goToNextQuestion}>
                    Next Question
                  </Button>
                )
              : (
                  <Button asChild>
                    <Link href="/practices">
                      <Home className="mr-2 h-4 w-4" />
                      Return to Practices
                    </Link>
                  </Button>
                )}
          </CardFooter>
        </Card>

        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href={`/practices/${slug}`}>
              Try Again
            </Link>
          </Button>
          <Button asChild>
            <Link href="/practices">
              All Practices
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
