'use client'

import { formatDistanceToNow } from 'date-fns'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useReducer, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { safeFetch } from '@/lib/fetch-utils'

interface Practice {
  id: number
  title: string
  slug: string
  description: string | null
  timeLimit: number
  createdAt: string
}

interface PracticeAttempt {
  id: number
  completedAt: string | null
  score: number | null
}

interface State {
  practices: Practice[]
  attempts: Record<number, PracticeAttempt | null>
  loading: boolean
}

type Action
  = | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS', practices: Practice[], attempts: Record<number, PracticeAttempt | null> }
    | { type: 'FETCH_ERROR' }

const initialState: State = {
  practices: [],
  attempts: {},
  loading: true,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { practices: action.practices, attempts: action.attempts, loading: false }
    case 'FETCH_ERROR':
      return { ...state, loading: false }
    default:
      return state
  }
}

export default function PracticesPage() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let ignore = false
    const fetchPracticesAndAttempts = async () => {
      // Fetch practices
      const { data: practicesData, error: practicesError } = await safeFetch<Practice[]>('/api/practices')
      if (practicesError) {
        if (!ignore)
          console.error('Error fetching practices:', practicesError)
        if (!ignore)
          toast.error('Failed to fetch practice exercises')
        if (!ignore)
          dispatch({ type: 'FETCH_ERROR' })
        return
      }

      // Fetch user attempts
      const { data: attemptsData } = await safeFetch<PracticeAttempt[]>('/api/practice-attempts/user')
      const attemptsMap: Record<number, PracticeAttempt | null> = {}
      if (!ignore && attemptsData) {
        attemptsData.forEach((attempt: PracticeAttempt) => {
          attemptsMap[attempt.id] = attempt
        })
      }

      if (!ignore) {
        dispatch({
          type: 'FETCH_SUCCESS',
          practices: practicesData || [],
          attempts: attemptsMap,
        })
      }
    }

    fetchPracticesAndAttempts()
    return () => {
      ignore = true
    }
  }, [])

  const handlePracticeClick = (practice: Practice) => {
    setSelectedPractice(practice)
    setShowDialog(true)
  }

  const handleStartPractice = () => {
    if (selectedPractice) {
      router.push(`/practices/${selectedPractice.slug}`)
    }
  }

  const hasCompletedAttempt = (practiceId: number) => {
    return state.attempts[practiceId]?.completedAt !== null && state.attempts[practiceId]?.completedAt !== undefined
  }

  if (state.loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container py-8 mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Practice Exercises</h1>

      {state.practices.length === 0
        ? (
            <div className="text-center py-8">
              <p>No practice exercises available at the moment.</p>
            </div>
          )
        : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.practices.map((practice) => {
                const completed = hasCompletedAttempt(practice.id)

                return (
                  <div key={practice.id} className="cursor-pointer">
                    <Card
                      className={`h-full hover:shadow-md transition-shadow ${
                        completed ? 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900/30' : ''
                      }`}
                      onClick={() => handlePracticeClick(practice)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{practice.title}</CardTitle>
                          {completed && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          {practice.description || 'No description available'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          Time limit:
                          {' '}
                          {practice.timeLimit}
                          {' '}
                          minutes
                        </div>
                      </CardContent>
                      <CardFooter className="justify-between border-t p-4">
                        <div className="text-xs text-muted-foreground">
                          Added
                          {' '}
                          {formatDistanceToNow(new Date(practice.createdAt), { addSuffix: true })}
                        </div>
                        {completed
                          ? (
                              <Button size="sm" variant="outline" render={<Link href={`/practices/${practice.slug}/results?attemptId=${state.attempts[practice.id]?.id}`} />} nativeButton={false}>
                                View Results
                              </Button>
                            )
                          : (
                              <Button size="sm" variant="outline">
                                Start Practice
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            )}
                      </CardFooter>
                    </Card>
                  </div>
                )
              })}
            </div>
          )}

      {/* Information Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedPractice?.title || 'Practice Exercise'}</DialogTitle>
            <DialogDescription>
              {selectedPractice?.description || 'No description available'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div>
                <p className="font-medium">Time Limit</p>
                <p>
                  {selectedPractice?.timeLimit}
                  {' '}
                  minutes
                </p>
              </div>

              <div>
                <p className="font-medium">Instructions</p>
                <p>
                  {hasCompletedAttempt(selectedPractice?.id || 0)
                    ? 'You\'ve already completed this practice. You can view your results.'
                    : 'You will be presented with a series of questions to answer. The timer will begin once you start. You can submit your answers at any time or wait until the timer expires.'}
                </p>
                {hasCompletedAttempt(selectedPractice?.id || 0) && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                    Note: You can only attempt each practice once.
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            {hasCompletedAttempt(selectedPractice?.id || 0)
              ? (
                  <Button
                    onClick={() => {
                      setShowDialog(false)
                      router.push(`/practices/${selectedPractice?.slug}/results?attemptId=${state.attempts[selectedPractice?.id || 0]?.id}`)
                    }}
                  >
                    View Results
                  </Button>
                )
              : (
                  <Button onClick={handleStartPractice}>
                    Start Practice
                  </Button>
                )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
