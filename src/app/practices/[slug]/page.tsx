'use client'

import { AlarmClock, AlertCircle, Clock, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import { toast } from 'sonner'
import { rehypePlugins, remarkPlugins } from '@/components/markdown-plugins'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
import { Textarea } from '@/components/ui/textarea'
import { convertSecondsToTime } from '@/lib/utils'

interface Question {
  id: number
  content: string
  options?: string[]
  order: number
  explanation?: string
  questionType: 'option' | 'text'
  answerType: 'single' | 'multiple'
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
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({})
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [hasExistingAttempt, setHasExistingAttempt] = useState(false)
  const [existingAttemptId, setExistingAttemptId] = useState<number | null>(null)
  const [activeSections, setActiveSections] = useState<Record<number, boolean>>({})

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const visibilityRef = useRef<boolean>(true)
  const _questionRefs = useRef<Record<number, HTMLDivElement | null>>({}) // Renamed to avoid lint error

  // This function saves the current attempt data to localStorage
  const saveAttemptToLocalStorage = (newAttemptId?: number) => {
    if (!practice)
      return

    localStorage.setItem(`practice_attempt_${slug}`, JSON.stringify({
      attemptId: newAttemptId || attemptId,
      timeRemaining,
      userAnswers,
    }))
  }

  // This function starts a new attempt
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

  // Handle answer changes
  const handleAnswerChange = (questionId: number, answer: string | string[]) => {
    setUserAnswers((prev) => {
      // Create a new object to ensure React detects the change
      const updated = { ...prev }

      // Handle arrays properly
      if (Array.isArray(answer)) {
        updated[questionId] = [...answer]
      }
      else {
        updated[questionId] = answer
      }

      // Save to localStorage after state update
      setTimeout(() => saveAttemptToLocalStorage(), 0)

      return updated
    })
  }

  // Show the submit confirmation dialog
  const handleSubmitButtonClick = () => {
    setShowSubmitConfirmation(true)
  }

  // Submit the practice attempt
  const handleSubmit = async () => {
    if (!practice || !attemptId) {
      toast.error('Something went wrong. Please try again.')
      return
    }

    setSubmitting(true)
    setShowSubmitConfirmation(false)

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
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit practice attempt')
      }

      // Success
      localStorage.removeItem(`practice_attempt_${slug}`)
      if (timerRef.current)
        clearInterval(timerRef.current)

      setShowSummary(true)
    }
    catch (error) {
      console.error('Error submitting attempt:', error)
      toast.error('Failed to submit your answers. Please try again.')
    }
    finally {
      setSubmitting(false)
    }
  }

  // Navigate to the results page
  const handleFinish = () => {
    router.push(`/practices/${slug}/results?attemptId=${attemptId}`)
  }

  // Track scroll position and update active question
  useEffect(() => {
    if (!practice?.questions)
      return

    const handleScroll = () => {
      let newActiveSections = {}

      // Use document.getElementById instead of refs
      practice.questions.forEach((question) => {
        const element = document.getElementById(`question-${question.id}`)
        if (element) {
          const { top, bottom } = element.getBoundingClientRect()
          const inViewport = top <= 300 && bottom >= 200
          newActiveSections = {
            ...newActiveSections,
            [question.id]: inViewport,
          }
        }
      })
      setActiveSections(newActiveSections)
    }

    window.addEventListener('scroll', handleScroll)
    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [practice?.questions])

  // Main effect to load practice and check for existing attempts
  useEffect(() => {
    const checkForExistingAttempt = async () => {
      try {
        const response = await fetch(`/api/practice-attempts/check/${slug}`)
        if (response.ok) {
          const data = await response.json()
          if (data.exists && data.completed) {
            setHasExistingAttempt(true)
            setExistingAttemptId(data.attemptId)
            // Clear any existing attempt data
            localStorage.removeItem(`practice_attempt_${slug}`)
            return true // Indicate we found a completed attempt
          }
        }
        return false // No completed attempt found
      }
      catch (error) {
        console.error('Error checking for existing attempt:', error)
        return false
      }
    }

    const fetchPractice = async () => {
      try {
        // First check if user has already completed this practice
        const hasCompleted = await checkForExistingAttempt()

        // If completed, no need to fetch or start a new attempt
        if (hasCompleted) {
          setLoading(false)
          return
        }

        const response = await fetch(`/api/practices/${slug}`)
        if (!response.ok) {
          throw new Error('Failed to fetch practice')
        }
        const data = await response.json()
        setPractice(data)

        // Get saved attempt from localStorage
        const savedAttemptStr = localStorage.getItem(`practice_attempt_${slug}`)
        let savedAttempt = null
        let validSavedAttempt = false

        if (savedAttemptStr) {
          try {
            savedAttempt = JSON.parse(savedAttemptStr)
            // Verify the attempt exists and has time remaining
            if (savedAttempt && savedAttempt.timeRemaining > 0 && savedAttempt.attemptId) {
              // Verify the attempt actually exists in the database and isn't completed
              const checkResponse = await fetch(`/api/practice-attempts/${savedAttempt.attemptId}/verify`)
              if (checkResponse.ok) {
                const checkData = await checkResponse.json()
                if (checkData.exists && !checkData.completed) {
                  validSavedAttempt = true
                }
              }
            }
          }
          catch (e) {
            console.error('Error parsing saved attempt:', e)
          }
        }

        if (validSavedAttempt && savedAttempt) {
          // Resume the existing attempt
          setTimeRemaining(savedAttempt.timeRemaining)
          setUserAnswers(savedAttempt.userAnswers || {})
          setAttemptId(savedAttempt.attemptId)
        }
        else {
          // Clean up any invalid data and start fresh
          localStorage.removeItem(`practice_attempt_${slug}`)
          setTimeRemaining(data.timeLimit * 60)
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

  // Effect to manage timer
  useEffect(() => {
    if (!loading && practice && !hasExistingAttempt) {
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
              setShowSubmitConfirmation(true)
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
  }, [loading, practice, hasExistingAttempt])

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

  if (hasExistingAttempt) {
    return (
      <div className="container py-8 text-center mx-auto max-w-3xl">
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <h1 className="text-2xl font-bold">{practice.title}</h1>
            {practice.description && (
              <p className="text-muted-foreground mt-1">{practice.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-800/50 flex flex-col items-center justify-center">
              <AlertCircle className="h-12 w-12 text-amber-600 dark:text-amber-500 mb-4" />
              <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-400">You've already completed this practice</h2>
              <p className="text-amber-700 dark:text-amber-400/80 mt-2 mb-6 max-w-md text-center">
                You can only attempt each practice once. View your results to see how you performed.
              </p>
              <Button onClick={() => router.push(`/practices/${slug}/results?attemptId=${existingAttemptId}`)}>
                View Your Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalQuestions = practice.questions.length
  const answeredCount = Object.keys(userAnswers).length
  const progress = (answeredCount / totalQuestions) * 100

  // Helper function for rendering submit button content
  const renderSubmitButton = () => {
    if (submitting) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {' '}
          Submitting
        </>
      )
    }
    return 'Submit All Answers'
  }

  return (
    <div className="container py-6 mx-auto">
      <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
        {/* Sticky header with timer and progress */}
        <div className="sticky top-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold">{practice.title}</h1>
              {practice.description && (
                <p className="text-muted-foreground mt-1">{practice.description}</p>
              )}
            </div>

            <div className="flex items-center gap-4 bg-muted p-2 px-4 rounded-md">
              <Clock className="h-5 w-5 text-primary" />
              <div className="text-xl font-mono">
                {convertSecondsToTime(timeRemaining)}
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">
                {answeredCount}
                {' '}
                of
                {totalQuestions}
                {' '}
                questions answered
              </span>
              <Button
                variant="default"
                size="sm"
                onClick={handleSubmitButtonClick}
                disabled={submitting}
                className="ml-auto"
              >
                {renderSubmitButton()}
              </Button>
            </div>
            <Progress value={progress} className="h-2" />

            {answeredCount < totalQuestions && (
              <div className="mt-3 flex items-center justify-center text-sm text-muted-foreground">
                <AlarmClock className="h-4 w-4 mr-2" />
                Don't forget to answer all questions before submitting
              </div>
            )}
          </div>
        </div>

        {/* Practice content (shown at the top) */}
        {practice.content && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
                {practice.content}
              </Markdown>
            </CardContent>
          </Card>
        )}

        {/* All questions in a scrollable view */}
        <div className="space-y-12 mb-8">
          {practice.questions.map((question, index) => (
            <div
              key={question.id}
              id={`question-${question.id}`}
              className={`p-6 border rounded-lg shadow-sm transition-all ${
                activeSections[question.id] ? 'ring-2 ring-primary/20' : ''
              }`}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">
                    Question
                    {' '}
                    {index + 1}
                  </h3>
                  <div className={`text-sm px-3 py-1 rounded-full ${
                    userAnswers[question.id]
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}
                  >
                    {userAnswers[question.id] ? 'Answered' : 'Not answered'}
                  </div>
                </div>
                <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
                  {question.content}
                </Markdown>
              </div>

              {/* Option-type questions */}
              {question.questionType === 'option' && (
                /* eslint-disable-next-line style/multiline-ternary */
                question.answerType === 'single' ? (
                  // Single choice question
                  <div className="mt-6">
                    <RadioGroup
                      value={userAnswers[question.id] as string || ''}
                      onValueChange={value => handleAnswerChange(question.id, value)}
                      className="space-y-4"
                    >
                      {question.options?.map((option, i) => (
                        <div key={`${question.id}-${i}`} className="flex items-center space-x-3 border p-4 rounded-md hover:bg-muted/50 transition-colors">
                          <RadioGroupItem value={option} id={`question-${question.id}-option-${i}`} />
                          <Label
                            htmlFor={`question-${question.id}-option-${i}`}
                            className="flex-1 cursor-pointer"
                          >
                            <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>{option}</Markdown>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ) : (
                  // Multiple choice question
                  <div className="space-y-4 mt-6">
                    {question.options?.map((option, i) => {
                      // FIXED: Multiple choice selection bug
                      const currentAnswers = Array.isArray(userAnswers[question.id])
                        ? [...userAnswers[question.id] as string[]]
                        : []

                      // Create a unique ID for each checkbox to prevent selection issues
                      const optionId = `question-${question.id}-option-${i}-${option.substring(0, 5)}`

                      return (
                        <div key={`${question.id}-${i}`} className="flex items-start space-x-3 border p-4 rounded-md hover:bg-muted/50 transition-colors">
                          <Checkbox
                            id={optionId}
                            checked={currentAnswers.includes(option)}
                            onCheckedChange={(checked) => {
                              // Create a new copy of the current answers
                              const newAnswers = [...currentAnswers]

                              if (checked) {
                                // Add option if not already in array
                                if (!newAnswers.includes(option)) {
                                  newAnswers.push(option)
                                }
                              }
                              else {
                                // Remove option if in array
                                const index = newAnswers.indexOf(option)
                                if (index !== -1) {
                                  newAnswers.splice(index, 1)
                                }
                              }

                              // Update state with new array
                              handleAnswerChange(question.id, newAnswers)
                            }}
                            className="mt-1"
                          />
                          <Label
                            htmlFor={optionId}
                            className="flex-1 cursor-pointer"
                          >
                            <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>{option}</Markdown>
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                )
              )}

              {/* Text input question - FIXED RENDERING LOGIC */}
              {question.questionType === 'text' && (
                <div className="mt-6">
                  <Textarea
                    key={`text-${question.id}`} // Key helps with rendering
                    value={(userAnswers[question.id] as string) || ''}
                    onChange={e => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="min-h-[150px] w-full"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Fixed submit button at bottom */}
        <div className="fixed bottom-8 right-8 z-20">
          <Button
            size="lg"
            onClick={handleSubmitButtonClick}
            disabled={submitting}
            className="shadow-lg"
          >
            {renderSubmitButton()}
          </Button>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitConfirmation} onOpenChange={setShowSubmitConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Practice Attempt</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your answers? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 py-4">
            {practice.questions.map((question, index) => (
              <div
                key={question.id}
                className="flex flex-col items-center"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
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

          <div className="py-2 text-center">
            <p className="text-sm text-muted-foreground">
              You have answered
              {' '}
              {answeredCount}
              {' '}
              out of
              {' '}
              {totalQuestions}
              {' '}
              questions.
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-500 mt-2">
              Note: You can only attempt this practice once.
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setShowSubmitConfirmation(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting
                ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  )
                : 'Confirm Submission'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
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
            <Button onClick={handleFinish} size="lg">
              View Results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
