'use client'

import type { Practice } from './practice-data'
import { useRouter } from 'next/navigation'
import { useEffect, useReducer, useRef, useState } from 'react'
import { toast } from 'sonner'
import { safeFetch } from '@/lib/fetch-utils'
import {

  practiceDataReducer,
  uiReducer,
} from './practice-data'

export function usePractice(slug: string) {
  const router = useRouter()

  const [practiceData, practiceDataDispatch] = useReducer(practiceDataReducer, {
    practice: null,
    loading: true,
    hasExistingAttempt: false,
    timeRemaining: 0,
  })
  const [ui, uiDispatch] = useReducer(uiReducer, {
    showSummary: false,
    showSubmitConfirmation: false,
    submitting: false,
    activeSections: {},
  })
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({})
  const attemptIdRef = useRef<number | null>(null)
  const [existingAttemptId, setExistingAttemptId] = useState<number | null>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const visibilityRef = useRef<boolean>(true)
  const prevTimeTickRef = useRef(practiceData.timeRemaining)

  const saveAttemptToLocalStorage = (newAttemptId?: number) => {
    if (!practiceData.practice)
      return

    localStorage.setItem(`practice_attempt_${slug}`, JSON.stringify({
      attemptId: newAttemptId || attemptIdRef.current,
      timeRemaining: practiceData.timeRemaining,
      userAnswers,
    }))
  }

  const startNewAttempt = async (practiceId: number) => {
    const { data, error } = await safeFetch<{ id: number }>('/api/practice-attempts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        practiceId,
      }),
    })

    if (error) {
      console.error('Error starting attempt:', error)
      return
    }

    if (data) {
      attemptIdRef.current = data.id
      saveAttemptToLocalStorage(data.id)
    }
  }

  const saveAttemptToLocalStorageRef = useRef(saveAttemptToLocalStorage)
  const startNewAttemptRef = useRef(startNewAttempt)
  useEffect(() => {
    saveAttemptToLocalStorageRef.current = saveAttemptToLocalStorage
  })
  useEffect(() => {
    startNewAttemptRef.current = startNewAttempt
  })

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
      setTimeout(saveAttemptToLocalStorage, 0)

      return updated
    })
  }

  // Show the submit confirmation dialog
  const handleSubmitButtonClick = () => {
    uiDispatch({ type: 'SET_SHOW_SUBMIT_CONFIRMATION', showSubmitConfirmation: true })
  }

  // Submit the practice attempt
  const handleSubmit = async () => {
    if (!practiceData.practice || !attemptIdRef.current) {
      toast.error('Something went wrong. Please try again.')
      return
    }

    uiDispatch({ type: 'SET_SUBMITTING', submitting: true })
    uiDispatch({ type: 'SET_SHOW_SUBMIT_CONFIRMATION', showSubmitConfirmation: false })

    const { error } = await safeFetch(`/api/practice-attempts/${attemptIdRef.current}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers: userAnswers,
        timeSpent: (practiceData.practice.timeLimit * 60) - practiceData.timeRemaining,
      }),
    })

    if (error) {
      console.error('Error submitting attempt:', error)
      toast.error('Failed to submit your answers. Please try again.')
      uiDispatch({ type: 'SET_SUBMITTING', submitting: false })
      return
    }

    // Success
    localStorage.removeItem(`practice_attempt_${slug}`)
    clearInterval(timerRef.current!)

    uiDispatch({ type: 'SET_SHOW_SUMMARY', showSummary: true })
    uiDispatch({ type: 'SET_SUBMITTING', submitting: false })
  }

  // Navigate to the results page
  const handleFinish = () => {
    router.push(`/practices/${slug}/results?attemptId=${attemptIdRef.current}`)
  }

  // Track scroll position and update active question
  useEffect(() => {
    const questions = practiceData.practice?.questions
    if (!questions)
      return

    const handleScroll = () => {
      let newActiveSections = {}

      // Use document.getElementById instead of refs
      questions.forEach((question) => {
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
      uiDispatch({ type: 'SET_ACTIVE_SECTIONS', activeSections: newActiveSections })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [practiceData.practice?.questions])

  // Main effect to load practice and check for existing attempts
  /* eslint-disable react-you-might-not-need-an-effect/no-external-store-subscription -- data fetching on mount */
  useEffect(() => {
    const checkForExistingAttempt = async () => {
      const { data, error } = await safeFetch<{ exists: boolean, completed: boolean, attemptId: number }>(`/api/practice-attempts/check/${slug}`)

      if (error) {
        console.error('Error checking for existing attempt:', error)
        return false
      }

      if (data && data.exists && data.completed) {
        practiceDataDispatch({ type: 'SET_HAS_EXISTING_ATTEMPT', hasExistingAttempt: true })
        setExistingAttemptId(data.attemptId)
        // Clear any existing attempt data
        localStorage.removeItem(`practice_attempt_${slug}`)
        return true // Indicate we found a completed attempt
      }
      return false // No completed attempt found
    }

    const fetchPractice = async () => {
      // First check if user has already completed this practice
      const hasCompleted = await checkForExistingAttempt()

      // If completed, no need to fetch or start a new attempt
      if (hasCompleted) {
        practiceDataDispatch({ type: 'SET_LOADING', loading: false })
        return
      }

      const { data: fetchedPractice, error: practiceError } = await safeFetch<Practice>(`/api/practices/${slug}`)

      if (practiceError || !fetchedPractice) {
        console.error('Error fetching practice:', practiceError)
        toast.error('Failed to load practice exercise')
        practiceDataDispatch({ type: 'SET_LOADING', loading: false })
        return
      }

      practiceDataDispatch({ type: 'SET_PRACTICE', practice: fetchedPractice })

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
            const { data: checkData, error: checkError } = await safeFetch<{ exists: boolean, completed: boolean }>(`/api/practice-attempts/${savedAttempt.attemptId}/verify`)
            if (!checkError && checkData && checkData.exists && !checkData.completed) {
              validSavedAttempt = true
            }
          }
        }
        catch (e) {
          console.error('Error parsing saved attempt:', e)
        }
      }

      if (validSavedAttempt && savedAttempt) {
        // Resume the existing attempt
        practiceDataDispatch({ type: 'SET_TIME_REMAINING', timeRemaining: savedAttempt.timeRemaining })
        setUserAnswers(savedAttempt.userAnswers || {})
        attemptIdRef.current = savedAttempt.attemptId
      }
      else {
        // Clean up any invalid data and start fresh
        localStorage.removeItem(`practice_attempt_${slug}`)
        practiceDataDispatch({ type: 'SET_TIME_REMAINING', timeRemaining: fetchedPractice.timeLimit * 60 })
        startNewAttemptRef.current(fetchedPractice.id)
      }

      practiceDataDispatch({ type: 'SET_LOADING', loading: false })
    }

    fetchPractice()

    const handleVisibilityChange = () => {
      visibilityRef.current = !document.hidden
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(timerRef.current!)
    }
  }, [slug])
  /* eslint-enable react-you-might-not-need-an-effect/no-external-store-subscription */

  // Effect to manage timer — just ticks; side effects handled below
  useEffect(() => {
    if (practiceData.loading || !practiceData.practice || practiceData.hasExistingAttempt)
      return

    timerRef.current = setInterval(() => {
      if (visibilityRef.current) {
        practiceDataDispatch({ type: 'TICK' })
      }
    }, 1000)

    return () => {
      clearInterval(timerRef.current!)
    }
  }, [practiceData.loading, practiceData.practice, practiceData.hasExistingAttempt])

  // Timer side effects: save every 10 seconds, show dialog when expired
  useEffect(() => {
    const prev = prevTimeTickRef.current
    const curr = practiceData.timeRemaining

    // Only act when time actually decreased (a tick happened)
    if (prev > curr) {
      // Save to localStorage every 10 seconds
      if (curr > 0 && curr % 10 === 0) {
        saveAttemptToLocalStorageRef.current()
      }

      // Timer expired
      if (curr <= 0) {
        clearInterval(timerRef.current!)
        uiDispatch({ type: 'SET_SHOW_SUBMIT_CONFIRMATION', showSubmitConfirmation: true })
        saveAttemptToLocalStorageRef.current()
      }
    }

    prevTimeTickRef.current = curr
  }, [practiceData.timeRemaining])

  const handleCloseSubmitConfirmation = () => {
    uiDispatch({ type: 'SET_SHOW_SUBMIT_CONFIRMATION', showSubmitConfirmation: false })
  }

  const handleCloseSummary = () => {
    uiDispatch({ type: 'SET_SHOW_SUMMARY', showSummary: false })
  }

  const handleReturnToList = () => {
    router.push('/practices')
  }

  return {
    practiceData,
    ui,
    userAnswers,
    existingAttemptId,
    handleAnswerChange,
    handleSubmitButtonClick,
    handleSubmit,
    handleFinish,
    handleCloseSubmitConfirmation,
    handleCloseSummary,
    handleReturnToList,
  }
}
