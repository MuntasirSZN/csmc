'use client'

import type { Practice } from './practice-types'
import { useEffect, useReducer } from 'react'
import { toast } from 'sonner'
import { safeFetch } from '@/lib/fetch-utils'
import { DeleteConfirmDialog } from './delete-dialog'
import { PracticeForm } from './practice-form'
import { PracticeList } from './practice-list'
import { formReducer, generateSlugUtil, initialFormState, initialManageState, manageReducer } from './practice-types'
import { PracticeView } from './practice-view'

export default function ManagePracticesPage() {
  const [manageState, dispatchManage] = useReducer(manageReducer, initialManageState)
  const [formState, dispatchForm] = useReducer(formReducer, initialFormState)

  const { loading, fetchingPractices, practices, mode, currentPractice, dialogOpen, practiceToDelete } = manageState
  const { title, description, content, timeLimit, questions } = formState

  const practiceData = {
    title,
    slug: generateSlugUtil(title),
    description: description || null,
    content,
    timeLimit,
    questions: questions.map(q => ({
      content: q.content,
      options: q.questionType === 'option' ? q.options?.filter(Boolean) : undefined,
      correctAnswer: q.questionType === 'option' && q.answerType === 'single' ? q.correctAnswer : undefined,
      correctAnswers: q.questionType === 'text' || q.answerType === 'multiple' ? q.correctAnswers : undefined,
      explanation: q.explanation,
      questionType: q.questionType,
      answerType: q.answerType,
      order: q.order,
    })),
  }

  const fetchPractices = async () => {
    dispatchManage({ type: 'FETCH_PRACTICES_START' })
    const { data, error } = await safeFetch('/api/admin/practices')
    if (error) {
      toast.error('Failed to fetch practices', { description: error.message })
      dispatchManage({ type: 'FETCH_PRACTICES_ERROR' })
    }
    else {
      dispatchManage({ type: 'FETCH_PRACTICES_SUCCESS', practices: data })
    }
  }

  useEffect(() => {
    let ignore = false
    const loadPractices = async () => {
      if (ignore)
        return
      const { data, error } = await safeFetch('/api/admin/practices')
      if (error) {
        toast.error('Failed to fetch practices', { description: error.message || 'An unexpected error occurred' })
        dispatchManage({ type: 'FETCH_PRACTICES_ERROR' })
      }
      else {
        dispatchManage({ type: 'FETCH_PRACTICES_SUCCESS', practices: data })
      }
    }
    loadPractices()
    return () => {
      ignore = true
    }
  }, [])

  const fetchPractice = async (slug: string) => {
    dispatchManage({ type: 'SET_LOADING', loading: true })
    const { data, error } = await safeFetch(`/api/admin/practices?slug=${slug}`)
    dispatchManage({ type: 'SET_LOADING', loading: false })
    if (error) {
      toast.error('Failed to fetch practice', { description: error.message })
      return null
    }
    return data as Practice
  }

  const switchMode = async (
    newMode: 'list' | 'create' | 'edit' | 'view',
    practice?: Practice,
  ) => {
    if (newMode === 'create') {
      dispatchForm({ type: 'RESET_FORM' })
    }
    else if ((newMode === 'edit' || newMode === 'view') && practice) {
      dispatchManage({ type: 'SET_CURRENT_PRACTICE', practice })
      const fullPractice = await fetchPractice(practice.slug)
      if (!fullPractice)
        return
      dispatchManage({ type: 'SET_CURRENT_PRACTICE', practice: fullPractice })
      if (newMode === 'edit')
        dispatchForm({ type: 'LOAD_FORM', practice: fullPractice })
    }
    dispatchManage({ type: 'SET_MODE', mode: newMode })
  }

  const validateForm = () => {
    if (!title.trim()) {
      toast.error('Title is required')
      dispatchForm({ type: 'SET_ACTIVE_TAB', tab: 'details' })
      return false
    }

    if (timeLimit <= 0) {
      toast.error('Time limit must be greater than 0')
      dispatchForm({ type: 'SET_ACTIVE_TAB', tab: 'details' })
      return false
    }

    let isValid = true
    questions.forEach((question, index) => {
      if (!question.content.trim()) {
        toast.error(`Question ${index + 1} content is required`)
        dispatchForm({ type: 'SET_ACTIVE_TAB', tab: 'questions' })
        isValid = false
        return
      }

      if (question.questionType === 'option') {
        if (
          !question.options
          || question.options.filter(option => option.trim()).length < 2
        ) {
          toast.error(`Question ${index + 1} must have at least 2 options`)
          dispatchForm({ type: 'SET_ACTIVE_TAB', tab: 'questions' })
          isValid = false
          return
        }

        if (question.answerType === 'single') {
          if (!question.correctAnswer || !question.correctAnswer.trim()) {
            toast.error(`Question ${index + 1} needs a correct answer`)
            dispatchForm({ type: 'SET_ACTIVE_TAB', tab: 'questions' })
            isValid = false
            return
          }
          if (!question.options.includes(question.correctAnswer)) {
            toast.error(`Question ${index + 1}'s correct answer must be one of the options`)
            dispatchForm({ type: 'SET_ACTIVE_TAB', tab: 'questions' })
            isValid = false
          }
        }
        else {
          if (!question.correctAnswers || question.correctAnswers.length === 0) {
            toast.error(`Question ${index + 1} needs at least one correct answer`)
            dispatchForm({ type: 'SET_ACTIVE_TAB', tab: 'questions' })
            isValid = false
            return
          }
          const allInOptions = question.correctAnswers.every(answer =>
            question.options?.includes(answer),
          )
          if (!allInOptions) {
            toast.error(`Question ${index + 1}'s correct answers must all be in the options list`)
            dispatchForm({ type: 'SET_ACTIVE_TAB', tab: 'questions' })
            isValid = false
          }
        }
      }
      else {
        if (!question.correctAnswers || question.correctAnswers.length === 0) {
          toast.error(`Question ${index + 1} needs at least one acceptable answer`)
          dispatchForm({ type: 'SET_ACTIVE_TAB', tab: 'questions' })
          isValid = false
        }
      }
    })

    return isValid
  }
  const handleCreate = async () => {
    if (!validateForm())
      return
    dispatchManage({ type: 'SET_LOADING', loading: true })
    const { error } = await safeFetch('/api/admin/practices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(practiceData),
    })
    dispatchManage({ type: 'SET_LOADING', loading: false })
    if (error) {
      toast.error('Failed to create practice', { description: error.message })
      return
    }
    toast.success('Practice created successfully!')
    fetchPractices()
    dispatchManage({ type: 'SET_MODE', mode: 'list' })
  }

  const handleUpdate = async () => {
    if (!validateForm() || !currentPractice)
      return
    dispatchManage({ type: 'SET_LOADING', loading: true })
    const { error } = await safeFetch('/api/admin/practices', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: currentPractice.id, ...practiceData }),
    })
    dispatchManage({ type: 'SET_LOADING', loading: false })
    if (error) {
      toast.error('Failed to update practice', { description: error.message })
      return
    }
    toast.success('Practice updated successfully!')
    fetchPractices()
    dispatchManage({ type: 'SET_MODE', mode: 'list' })
  }

  const confirmDelete = async () => {
    if (!practiceToDelete)
      return
    dispatchManage({ type: 'SET_LOADING', loading: true })
    const { error } = await safeFetch(`/api/admin/practices?id=${practiceToDelete.id}`, { method: 'DELETE' })
    dispatchManage({ type: 'SET_LOADING', loading: false })
    if (error) {
      toast.error('Failed to delete practice', { description: error.message })
      return
    }
    toast.success('Practice deleted successfully!')
    dispatchManage({ type: 'CLOSE_DIALOG' })
    fetchPractices()
  }

  return (
    <div className="container py-8 mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Practices</h1>

      {mode === 'list' && (
        <PracticeList
          practices={practices}
          fetchingPractices={fetchingPractices}
          onCreate={() => switchMode('create')}
          onView={practice => switchMode('view', practice)}
          onEdit={practice => switchMode('edit', practice)}
          onDelete={practice => dispatchManage({ type: 'OPEN_DIALOG', practice })}
        />
      )}

      {mode === 'view' && currentPractice && (
        <PracticeView
          practice={currentPractice}
          onBack={() => dispatchManage({ type: 'SET_MODE', mode: 'list' })}
          onEdit={() => switchMode('edit', currentPractice)}
          onDelete={() => dispatchManage({ type: 'OPEN_DIALOG', practice: currentPractice })}
        />
      )}

      {(mode === 'create' || mode === 'edit') && (
        <PracticeForm
          mode={mode}
          formState={formState}
          dispatchForm={dispatchForm}
          loading={loading}
          onBack={() => dispatchManage({ type: 'SET_MODE', mode: 'list' })}
          onSubmit={mode === 'create' ? handleCreate : handleUpdate}
        />
      )}

      <DeleteConfirmDialog
        open={dialogOpen}
        practiceToDelete={practiceToDelete}
        loading={loading}
        onConfirm={confirmDelete}
        onClose={() => dispatchManage({ type: 'CLOSE_DIALOG' })}
      />
    </div>
  )
}
