'use client'

import { rehypePlugins, remarkPlugins } from '@/components/markdown-plugins'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { convertSecondsToTime } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'

import { toast } from 'sonner'

interface Question {
  id: number
  content: string
  options: string[]
  order: number
}

interface Practice {
  id: number
  title: string
  slug: string
  description: string | null
  content: string
  timeLimit: number
  questions: Question[]
}

export default function PracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()

  const [practice, setPractice] = useState<Practice | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const visibilityRef = useRef<boolean>(true)

  const saveAttemptToLocalStorage = (newAttemptId?: number) => {
    if (!practice)
      return

    localStorage.setItem(`practice_attempt_${slug}`, JSON.stringify({
      attemptId: newAttemptId || attemptId,
      timeRemaining,
      userAnswers,
      currentQuestionIndex,
    }))
  }

  const startNewAttempt = async (practiceId: number) => {
    try {
      const response = await fetch('/api/practice-attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          practiceId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to start practice attempt')
      }

      const data = await response.json()
      setAttemptId(data.id)

      saveAttemptToLocalStorage(data.id)
    }
    catch (error) {
      console.error('Error starting attempt:', error)
    }
  }

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setUserAnswers((prev) => {
      const updated = { ...prev, [questionId]: answer }

      setTimeout(() => saveAttemptToLocalStorage(), 0)

      return updated
    })
  }

  const goToNextQuestion = () => {
    if (!practice || currentQuestionIndex >= practice.questions.length - 1)
      return
    setCurrentQuestionIndex(prev => prev + 1)
  }

  const goToPrevQuestion = () => {
    if (currentQuestionIndex <= 0)
      return
    setCurrentQuestionIndex(prev => prev - 1)
  }

  const handleSubmit = async () => {
    if (!practice || !attemptId)
      return

    setSubmitting(true)

    try {
      const response = await fetch(`/api/practice-attempts/${attemptId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: userAnswers,
          timeSpent: (practice.timeLimit * 60) - timeRemaining,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit practice attempt')
      }

      setShowSummary(true)

      localStorage.removeItem(`practice_attempt_${slug}`)

      if (timerRef.current)
        clearInterval(timerRef.current)
    }
    catch (error) {
      console.error('Error submitting attempt:', error)
      toast.error('Failed to submit your answers')
    }
    finally {
      setSubmitting(false)
    }
  }

  const handleFinish = () => {
    router.push(`/practices/${slug}/results?attemptId=${attemptId}`)
  }

  useEffect(() => {
    const fetchPractice = async () => {
      try {
        const response = await fetch(`/api/practices/${slug}`)
        if (!response.ok) {
          throw new Error('Failed to fetch practice')
        }
        const data = await response.json()
        setPractice(data)

        setTimeRemaining(data.timeLimit * 60)

        const savedAttempt = localStorage.getItem(`practice_attempt_${slug}`)
        if (savedAttempt) {
          const parsedAttempt = JSON.parse(savedAttempt)
          if (parsedAttempt.timeRemaining > 0) {
            setTimeRemaining(parsedAttempt.timeRemaining)
            setUserAnswers(parsedAttempt.userAnswers || {})
            setCurrentQuestionIndex(parsedAttempt.currentQuestionIndex || 0)
            setAttemptId(parsedAttempt.attemptId)
          }
          else {
            localStorage.removeItem(`practice_attempt_${slug}`)
            startNewAttempt(data.id)
          }
        }
        else {
          startNewAttempt(data.id)
        }
      }
      catch (error) {
        console.error('Error fetching practice:', error)
        toast.error('Failed to load practice exercise')
      }
      finally {
        setLoading(false)
      }
    }

    fetchPractice()

    const handleVisibilityChange = () => {
      visibilityRef.current = !document.hidden
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (timerRef.current)
        clearInterval(timerRef.current)
    }
  }, [slug])

  useEffect(() => {
    if (!loading && practice) {
      timerRef.current = setInterval(() => {
        if (visibilityRef.current) {
          setTimeRemaining((prev) => {
            const newTime = prev - 1

            if (newTime % 10 === 0) {
              saveAttemptToLocalStorage()
            }

            if (newTime <= 0) {
              if (timerRef.current)
                clearInterval(timerRef.current)
              handleSubmit()
              return 0
            }

            return newTime
          })
        }
      }, 1000)
    }

    return () => {
      if (timerRef.current)
        clearInterval(timerRef.current)
    }
  }, [loading, practice])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!practice) {
    return (
      <div className="container py-8 text-center mx-auto">
        <h1 className="text-2xl font-bold mb-4">Practice not found</h1>
        <p>The practice exercise you're looking for doesn't exist.</p>
        <Button className="mt-4" onClick={() => router.push('/practices')}>
          Return to Practice List
        </Button>
      </div>
    )
  }

  const currentQuestion = practice.questions[currentQuestionIndex]
  const totalQuestions = practice.questions.length
  const progress = (currentQuestionIndex + 1) / totalQuestions * 100

  return (
    <div className="container py-6 pt-15 text-center mx-auto">
      <div className="flex flex-col space-y-6">
        {/* Header with timer and progress */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{practice.title}</h1>
            {practice.description && (
              <p className="text-muted-foreground mt-1">{practice.description}</p>
            )}
          </div>

          <div className="flex items-center gap-4 bg-muted p-2 rounded-md">
            <div className="text-xl font-mono">
              {convertSecondsToTime(timeRemaining)}
            </div>
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting
                ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {' '}
                      Submitting
                    </>
                  )
                : (
                    'Submit'
                  )}
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>
              Question
              {currentQuestionIndex + 1}
              {' '}
              of
              {totalQuestions}
            </span>
            <span>
              {Object.keys(userAnswers).length}
              {' '}
              of
              {totalQuestions}
              {' '}
              answered
            </span>
          </div>
        </div>

        {/* Practice content (shown at the top) */}
        {practice.content && (
          <Card className="mb-4">
            <CardContent className="pt-6">
              <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
                {practice.content}
              </Markdown>
            </CardContent>
          </Card>
        )}

        {/* Current question */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
                {currentQuestion.content}
              </Markdown>
            </div>

            <RadioGroup
              value={userAnswers[currentQuestion.id] || ''}
              onValueChange={value => handleAnswerSelect(currentQuestion.id, value)}
              className="space-y-4 mt-6"
            >
              {currentQuestion.options.map((option, i) => (
                <div key={i} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50">
                  <RadioGroupItem value={option} id={`option-${i}`} />
                  <Label htmlFor={`option-${i}`} className="flex-1 cursor-pointer">
                    <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>{option}</Markdown>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={goToPrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          <Button
            onClick={goToNextQuestion}
            disabled={currentQuestionIndex === totalQuestions - 1}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Practice Summary</DialogTitle>
            <DialogDescription>
              You've completed the practice. Here's a summary of your answers.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 py-4">
            {practice.questions.map((question, index) => (
              <div
                key={question.id}
                className="flex flex-col items-center"
              >
                <div
                  className={`size-10 rounded-full flex items-center justify-center font-medium ${
                    userAnswers[question.id]
                      ? 'bg-primary/20 text-primary'
                      : 'bg-destructive/20 text-destructive'
                  }`}
                >
                  {index + 1}
                </div>
                <Checkbox
                  checked={!!userAnswers[question.id]}
                  className="mt-1"
                  disabled
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={handleFinish}>
              View Results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
