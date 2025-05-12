'use client'

import { ExplanationCallout } from '@/components/explanation-callout'
import { rehypePlugins, remarkPlugins } from '@/components/markdown-plugins'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Eye, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { toast } from 'sonner'

interface Question {
  content: string
  options?: string[]
  correctAnswer?: string
  correctAnswers?: string[]
  explanation?: string
  questionType: 'option' | 'text'
  answerType: 'single' | 'multiple'
  order: number
}

interface Practice {
  id: number
  title: string
  slug: string
  description: string | null
  content: string
  timeLimit: number
  createdAt: string
  updatedAt: string
  questions?: Question[]
}

export default function ManagePracticesPage() {
  const [loading, setLoading] = useState(false)
  const [fetchingPractices, setFetchingPractices] = useState(true)
  const [practices, setPractices] = useState<Practice[]>([])
  const [mode, setMode] = useState<'list' | 'create' | 'edit' | 'view'>('list')
  const [currentPractice, setCurrentPractice] = useState<Practice | null>(null)
  const [activeTab, setActiveTab] = useState('details')

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [practiceToDelete, setPracticeToDelete] = useState<Practice | null>(null)

  // Practice details
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [timeLimit, setTimeLimit] = useState(30)

  // Questions
  const [questions, setQuestions] = useState<Question[]>([
    {
      content: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      questionType: 'option',
      answerType: 'single',
      order: 0,
    },
  ])

  // Preview
  const [previewMode, setPreviewMode] = useState<'details' | 'questions'>('details')

  // Function to fetch all practices
  const fetchPractices = async () => {
    setFetchingPractices(true)
    try {
      const response = await fetch('/api/admin/practices')
      if (!response.ok) {
        throw new Error('Failed to fetch practices')
      }
      const data = await response.json()
      setPractices(data)
    }
    catch (error: any) {
      toast.error('Failed to fetch practices', {
        description: error.message || 'An unexpected error occurred',
      })
    }
    finally {
      setFetchingPractices(false)
    }
  }

  // Fetch all practices on load
  useEffect(() => {
    fetchPractices()
  }, [])

  // Function to fetch a single practice
  const fetchPractice = async (slug: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/practices?slug=${slug}`)
      if (!response.ok) {
        throw new Error('Failed to fetch practice')
      }
      const data = await response.json()
      return data
    }
    catch (error: any) {
      toast.error('Failed to fetch practice', {
        description: error.message || 'An unexpected error occurred',
      })
      return null
    }
    finally {
      setLoading(false)
    }
  }

  // Reset form for create mode
  const resetForm = () => {
    setTitle('')
    setDescription('')
    setContent('')
    setTimeLimit(30)
    setQuestions([
      {
        content: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        questionType: 'option',
        answerType: 'single',
        order: 0,
      },
    ])
    setActiveTab('details')
  }

  // Set form values from practice for edit mode
  const loadPracticeForEdit = (practice: Practice) => {
    setTitle(practice.title)
    setDescription(practice.description || '')
    setContent(practice.content)
    setTimeLimit(practice.timeLimit)

    // If questions exist, use them; otherwise create a default question
    if (practice.questions && practice.questions.length > 0) {
      // Make sure all questions have the new fields
      const updatedQuestions = practice.questions.map(q => ({
        ...q,
        questionType: q.questionType || 'option',
        answerType: q.answerType || 'single',
        explanation: q.explanation || '',
        correctAnswers: q.correctAnswers || [],
        options: q.options || ['', '', '', ''],
      }))
      setQuestions(updatedQuestions)
    }
    else {
      setQuestions([
        {
          content: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          explanation: '',
          questionType: 'option',
          answerType: 'single',
          order: 0,
        },
      ])
    }
    setActiveTab('details')
  }

  // Handle mode switching
  const switchMode = async (newMode: 'list' | 'create' | 'edit' | 'view', practice?: Practice) => {
    if (newMode === 'create') {
      resetForm()
    }
    else if (newMode === 'edit' && practice) {
      setCurrentPractice(practice)
      const fullPractice = await fetchPractice(practice.slug)
      if (fullPractice) {
        setCurrentPractice(fullPractice)
        loadPracticeForEdit(fullPractice)
      }
      else {
        return // Don't switch mode if fetch failed
      }
    }
    else if (newMode === 'view' && practice) {
      setCurrentPractice(practice)
      const fullPractice = await fetchPractice(practice.slug)
      if (fullPractice) {
        setCurrentPractice(fullPractice)
      }
      else {
        return // Don't switch mode if fetch failed
      }
    }
    setMode(newMode)
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        content: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        questionType: 'option',
        answerType: 'single',
        order: questions.length,
      },
    ])
  }

  const removeQuestion = (indexToRemove: number) => {
    if (questions.length <= 1) {
      toast.error('At least one question is required')
      return
    }

    setQuestions(
      questions
        .filter((_, index) => index !== indexToRemove)
        .map((question, index) => ({ ...question, order: index })),
    )
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions]

    // If changing questionType, reset correctAnswer or correctAnswers based on new type
    if (field === 'questionType') {
      if (value === 'text') {
        // Text questions use correctAnswers array
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          questionType: value,
          correctAnswer: undefined,
          correctAnswers: updatedQuestions[index].correctAnswers || [],
          options: undefined,
        }
      }
      else {
        // Option questions use different fields based on answerType
        if (updatedQuestions[index].answerType === 'single') {
          updatedQuestions[index] = {
            ...updatedQuestions[index],
            questionType: value,
            correctAnswer: '',
            correctAnswers: undefined,
            options: ['', '', '', ''],
          }
        }
        else {
          updatedQuestions[index] = {
            ...updatedQuestions[index],
            questionType: value,
            correctAnswer: undefined,
            correctAnswers: [],
            options: ['', '', '', ''],
          }
        }
      }
    }
    // If changing answerType, adjust correctAnswer or correctAnswers
    else if (field === 'answerType') {
      if (value === 'single') {
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          answerType: value,
          correctAnswer: '',
          correctAnswers: undefined,
        }
      }
      else {
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          answerType: value,
          correctAnswer: undefined,
          correctAnswers: [],
        }
      }
    }
    // For all other fields, update normally
    else {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
      }
    }

    setQuestions(updatedQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    const options = [...(updatedQuestions[questionIndex].options || [])]
    options[optionIndex] = value
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options,
    }

    // Update correctAnswer if this was the selected option
    const question = updatedQuestions[questionIndex]
    if (question.answerType === 'single' && question.correctAnswer === options[optionIndex]) {
      question.correctAnswer = value
    }

    // Update correctAnswers if this was one of the selected options
    if (question.answerType === 'multiple' && question.correctAnswers) {
      const oldValue = options[optionIndex]
      if (question.correctAnswers.includes(oldValue)) {
        question.correctAnswers = question.correctAnswers.map(a =>
          a === oldValue ? value : a,
        )
      }
    }

    setQuestions(updatedQuestions)
  }

  // FIXED: Improved toggleCorrectAnswer function to properly handle multiple selections
  const toggleCorrectAnswer = (questionIndex: number, option: string) => {
    // Create a new questions array
    const updatedQuestions = [...questions]

    // Get the specific question
    const question = { ...updatedQuestions[questionIndex] }

    if (question.answerType === 'multiple') {
      // For multiple answers questions, create a fresh copy of the array
      const correctAnswers = [...(question.correctAnswers || [])]

      // Check if this option is already selected
      const index = correctAnswers.indexOf(option)

      if (index >= 0) {
        // Remove from correctAnswers if already present
        correctAnswers.splice(index, 1)
      }
      else {
        // Add to correctAnswers if not present
        correctAnswers.push(option)
      }

      // Update the question with the new correctAnswers array
      updatedQuestions[questionIndex] = {
        ...question,
        correctAnswers,
      }
    }
    else {
      // For single answer questions
      updatedQuestions[questionIndex] = {
        ...question,
        correctAnswer: option,
      }
    }

    // Update the questions state
    setQuestions(updatedQuestions)
  }

  const updateCorrectAnswers = (questionIndex: number, answers: string[]) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      correctAnswers: answers,
    }
    setQuestions(updatedQuestions)
  }

  const validateForm = () => {
    // Check basic practice details
    if (!title.trim()) {
      toast.error('Title is required')
      setActiveTab('details')
      return false
    }

    if (timeLimit <= 0) {
      toast.error('Time limit must be greater than 0')
      setActiveTab('details')
      return false
    }

    // Check each question
    let isValid = true
    questions.forEach((question, index) => {
      if (!question.content.trim()) {
        toast.error(`Question ${index + 1} content is required`)
        setActiveTab('questions')
        isValid = false
        return
      }

      if (question.questionType === 'option') {
        // Validate option-based questions
        if (!question.options || question.options.filter(option => option.trim()).length < 2) {
          toast.error(`Question ${index + 1} must have at least 2 options`)
          setActiveTab('questions')
          isValid = false
          return
        }

        if (question.answerType === 'single') {
          // Validate single answer questions
          if (!question.correctAnswer || !question.correctAnswer.trim()) {
            toast.error(`Question ${index + 1} needs a correct answer`)
            setActiveTab('questions')
            isValid = false
            return
          }

          if (!question.options.includes(question.correctAnswer)) {
            toast.error(`Question ${index + 1}'s correct answer must be one of the options`)
            setActiveTab('questions')
            isValid = false
          }
        }
        else {
          // Validate multiple answer questions
          if (!question.correctAnswers || question.correctAnswers.length === 0) {
            toast.error(`Question ${index + 1} needs at least one correct answer`)
            setActiveTab('questions')
            isValid = false
            return
          }

          // Check if all correctAnswers are in the options
          const allInOptions = question.correctAnswers.every(answer =>
            question.options?.includes(answer),
          )
          if (!allInOptions) {
            toast.error(`Question ${index + 1}'s correct answers must all be in the options list`)
            setActiveTab('questions')
            isValid = false
          }
        }
      }
      else {
        // Validate text-input questions
        if (!question.correctAnswers || question.correctAnswers.length === 0) {
          toast.error(`Question ${index + 1} needs at least one acceptable answer`)
          setActiveTab('questions')
          isValid = false
        }
      }
    })

    return isValid
  }

  const handleCreate = async () => {
    if (!validateForm())
      return

    setLoading(true)

    const practiceData = {
      title,
      slug: generateSlug(title),
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

    try {
      const response = await fetch('/api/admin/practices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(practiceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create practice')
      }

      toast.success('Practice created successfully!')
      fetchPractices()
      setMode('list')
    }
    catch (error: any) {
      toast.error('Failed to create practice', {
        description: error.message || 'An unexpected error occurred',
      })
    }
    finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!validateForm() || !currentPractice)
      return

    setLoading(true)

    const practiceData = {
      id: currentPractice.id,
      title,
      slug: generateSlug(title),
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

    try {
      const response = await fetch('/api/admin/practices', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(practiceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update practice')
      }

      toast.success('Practice updated successfully!')
      fetchPractices()
      setMode('list')
    }
    catch (error: any) {
      toast.error('Failed to update practice', {
        description: error.message || 'An unexpected error occurred',
      })
    }
    finally {
      setLoading(false)
    }
  }

  const handleDelete = async (practice: Practice) => {
    setPracticeToDelete(practice)
    setDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!practiceToDelete)
      return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/practices?id=${practiceToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete practice')
      }

      toast.success('Practice deleted successfully!')
      setDialogOpen(false)
      setPracticeToDelete(null)
      fetchPractices()
    }
    catch (error: any) {
      toast.error('Failed to delete practice', {
        description: error.message || 'An unexpected error occurred',
      })
    }
    finally {
      setLoading(false)
    }
  }

  const renderLoadingState = () => (
    <div className="flex justify-center my-8">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )

  return (
    <div className="container py-8 mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Practices</h1>

      {/* Practice List View */}
      {mode === 'list' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Practices</h2>
            <Button onClick={() => switchMode('create')}>
              <Plus className="mr-2 h-4 w-4" />
              {' '}
              New Practice
            </Button>
          </div>

          {fetchingPractices
            ? (
                renderLoadingState()
              )
            : practices.length === 0
              ? (
                  <div className="text-center p-8 border rounded-md bg-muted/50">
                    <p className="text-muted-foreground">No practices found. Create your first practice!</p>
                  </div>
                )
              : (
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Time Limit</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="w-[120px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {practices.map(practice => (
                            <TableRow key={practice.id}>
                              <TableCell className="font-medium">{practice.title}</TableCell>
                              <TableCell>
                                {practice.timeLimit}
                                {' '}
                                minutes
                              </TableCell>
                              <TableCell>{new Date(practice.updatedAt).toLocaleDateString()}</TableCell>
                              <TableCell className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => switchMode('view', practice)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => switchMode('edit', practice)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDelete(practice)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
        </div>
      )}

      {/* View Practice */}
      {mode === 'view' && currentPractice && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setMode('list')}>
              Back to List
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => switchMode('edit', currentPractice)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                {' '}
                Edit
              </Button>
              <Button
                variant="outline"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => handleDelete(currentPractice)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {' '}
                Delete
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{currentPractice.title}</CardTitle>
              {currentPractice.description && (
                <CardDescription>{currentPractice.description}</CardDescription>
              )}
              <div className="text-sm text-muted-foreground mt-2">
                Time Limit:
                {' '}
                {currentPractice.timeLimit}
                {' '}
                minutes
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Practice Content</h3>
                <div className="prose dark:prose-invert max-w-none border p-4 rounded-md bg-muted/20">
                  <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
                    {currentPractice.content || 'No content'}
                  </Markdown>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Questions</h3>
                <div className="space-y-6">
                  {currentPractice.questions && currentPractice.questions.length > 0
                    ? (
                        currentPractice.questions.map((question, index) => (
                          <div key={index} className="border rounded-md p-4 bg-muted/20">
                            <h4 className="font-medium mb-2">
                              Question
                              {' '}
                              {index + 1}
                              {' '}
                              <span className="text-sm font-normal text-muted-foreground">
                                (
                                {question.questionType === 'option'
                                  ? `Multiple Choice (${question.answerType === 'single' ? 'Single Answer' : 'Multiple Answers'})`
                                  : 'Text Input'}
                                )
                              </span>
                            </h4>

                            <div className="mb-4">
                              <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
                                {question.content}
                              </Markdown>
                            </div>

                            {/* Show options for multiple choice questions */}
                            {question.questionType === 'option' && question.options && (
                              <div className="space-y-2 mb-4">
                                <h5 className="text-sm font-medium">Options:</h5>
                                {question.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`flex items-center p-2 border rounded-md ${
                                      (question.answerType === 'single' && option === question.correctAnswer)
                                      || (question.answerType === 'multiple' && question.correctAnswers?.includes(option))
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                        : ''
                                    }`}
                                  >
                                    <div className="mr-2 text-sm font-medium text-muted-foreground">
                                      {String.fromCharCode(65 + optIndex)}
                                      .
                                    </div>
                                    <div className="flex-1">
                                      <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
                                        {option}
                                      </Markdown>
                                    </div>
                                    {(question.answerType === 'single' && option === question.correctAnswer) && (
                                      <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                                        Correct Answer
                                      </div>
                                    )}
                                    {(question.answerType === 'multiple' && question.correctAnswers?.includes(option)) && (
                                      <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                                        Correct Answer
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Show acceptable answers for text input questions */}
                            {question.questionType === 'text' && question.correctAnswers && (
                              <div className="mb-4">
                                <h5 className="text-sm font-medium mb-2">Acceptable Answers:</h5>
                                <div className="p-2 border rounded-md bg-green-50 dark:bg-green-900/20">
                                  <ul className="list-disc pl-5 space-y-1">
                                    {question.correctAnswers.map((answer, idx) => (
                                      <li key={idx}>{answer}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}

                            {/* Explanation if available */}
                            {question.explanation && (
                              <div className="mt-4">
                                <h5 className="text-sm font-medium mb-2">Explanation:</h5>
                                <div className="text-sm">
                                  <ExplanationCallout explanation={question.explanation} />
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )
                    : (
                        <div className="text-center p-4 text-muted-foreground">
                          No questions found for this practice
                        </div>
                      )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create/Edit Practice Form */}
      {(mode === 'create' || mode === 'edit') && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setMode('list')}>
              Back to List
            </Button>
            <h2 className="text-xl font-semibold">
              {mode === 'create' ? 'Create New Practice' : 'Edit Practice'}
            </h2>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="details">Practice Details</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            {/* Practice Details Tab */}
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Practice Information</CardTitle>
                  <CardDescription>Enter basic information about this practice exercise.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g., Algebra Basics Practice"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Brief description of what this practice covers"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">
                      Practice Content (supports Markdown with LaTex math)
                      <span className="ml-2 text-xs text-muted-foreground">
                        Use $ symbols for inline math or $$ for display math
                      </span>
                    </Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      placeholder="Main content or instructions for this practice"
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      min="1"
                      value={timeLimit}
                      onChange={e => setTimeLimit(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                </CardContent>

                <CardFooter>
                  <Button onClick={() => setActiveTab('questions')}>
                    Continue to Questions
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Questions Tab */}
            <TabsContent value="questions">
              <div className="space-y-6">
                {questions.map((question, questionIndex) => (
                  <Card key={questionIndex}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>
                        Question
                        {' '}
                        {questionIndex + 1}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeQuestion(questionIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Question Type Selection */}
                      <div className="space-y-2">
                        <Label>Question Type</Label>
                        <RadioGroup
                          value={question.questionType}
                          onValueChange={value => updateQuestion(questionIndex, 'questionType', value)}
                          className="flex flex-row space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="option" id={`question-type-option-${questionIndex}`} />
                            <Label htmlFor={`question-type-option-${questionIndex}`}>Multiple Choice</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="text" id={`question-type-text-${questionIndex}`} />
                            <Label htmlFor={`question-type-text-${questionIndex}`}>Text Input</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Answer Type Selection (only for option questions) */}
                      {question.questionType === 'option' && (
                        <div className="space-y-2">
                          <Label>Answer Type</Label>
                          <RadioGroup
                            value={question.answerType}
                            onValueChange={value => updateQuestion(questionIndex, 'answerType', value)}
                            className="flex flex-row space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="single" id={`answer-type-single-${questionIndex}`} />
                              <Label htmlFor={`answer-type-single-${questionIndex}`}>Single Answer</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="multiple" id={`answer-type-multiple-${questionIndex}`} />
                              <Label htmlFor={`answer-type-multiple-${questionIndex}`}>Multiple Answers</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>
                          Question Content (supports Markdown with LaTex math)
                          <span className="ml-2 text-xs text-muted-foreground">
                            Use $ symbols for inline math or $$ for display math
                          </span>
                        </Label>
                        <Textarea
                          value={question.content}
                          onChange={e => updateQuestion(questionIndex, 'content', e.target.value)}
                          placeholder="Enter the question content"
                          rows={3}
                        />
                      </div>

                      {/* Options for Multiple Choice Questions */}
                      {question.questionType === 'option' && (
                        <div className="space-y-3">
                          <Label>Options</Label>
                          {question.options?.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <Input
                                value={option}
                                onChange={e => updateOption(questionIndex, optionIndex, e.target.value)}
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                              {/* eslint-disable-next-line style/multiline-ternary */}
                              {question.answerType === 'single' ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleCorrectAnswer(questionIndex, option)}
                                  className={
                                    question.correctAnswer === option
                                      ? 'bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400'
                                      : ''
                                  }
                                >
                                  {question.correctAnswer === option ? 'Correct ✓' : 'Set as correct'}
                                </Button>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`correct-${questionIndex}-${optionIndex}-${option.replace(/\s+/g, '-').substring(0, 10)}`}
                                    checked={(question.correctAnswers || []).includes(option)}
                                    onCheckedChange={(checked) => {
                                      // Create a fresh copy of all lists
                                      const updatedQuestions = [...questions]
                                      const updatedQuestion = { ...updatedQuestions[questionIndex] }
                                      const correctAnswers = [...(updatedQuestion.correctAnswers || [])]

                                      if (checked) {
                                        // Add if not already included
                                        if (!correctAnswers.includes(option)) {
                                          correctAnswers.push(option)
                                        }
                                      }
                                      else {
                                        // Remove if present
                                        const index = correctAnswers.indexOf(option)
                                        if (index !== -1) {
                                          correctAnswers.splice(index, 1)
                                        }
                                      }

                                      // Update the question with new array
                                      updatedQuestion.correctAnswers = correctAnswers
                                      updatedQuestions[questionIndex] = updatedQuestion

                                      // Update state
                                      setQuestions(updatedQuestions)
                                    }}
                                    disabled={!option.trim()}
                                  />
                                  <Label htmlFor={`correct-${questionIndex}-${optionIndex}-${option.replace(/\s+/g, '-').substring(0, 10)}`}>
                                    Correct Answer
                                  </Label>
                                </div>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updatedQuestions = [...questions]
                              updatedQuestions[questionIndex].options = [...(updatedQuestions[questionIndex].options || []), '']
                              setQuestions(updatedQuestions)
                            }}
                          >
                            Add Option
                          </Button>
                        </div>
                      )}

                      {/* Text Input Question - Acceptable Answers */}
                      {question.questionType === 'text' && (
                        <div className="space-y-2">
                          <Label>Acceptable Answers (one per line)</Label>
                          <Textarea
                            value={(question.correctAnswers || []).join('\n')}
                            onChange={(e) => {
                              const answers = e.target.value
                                .split('\n')
                                .filter(Boolean)
                                .map(answer => answer.trim())
                              updateCorrectAnswers(questionIndex, answers)
                            }}
                            placeholder="Enter acceptable answers, one per line"
                            rows={4}
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter all possible correct answers. The system will match exact answers.
                          </p>
                        </div>
                      )}

                      {/* Explanation Field */}
                      <div className="space-y-2">
                        <Label>Explanation (optional)</Label>
                        <Textarea
                          value={question.explanation || ''}
                          onChange={e => updateQuestion(questionIndex, 'explanation', e.target.value)}
                          placeholder="Explain the correct answer or solution approach"
                          rows={4}
                        />
                      </div>

                      {/* Explanation Preview */}
                      {question.explanation && (
                        <div className="mt-2 border p-3 rounded-md">
                          <p className="text-sm font-medium mb-2">Explanation Preview:</p>
                          <ExplanationCallout explanation={question.explanation} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={addQuestion}>
                    <Plus className="mr-2 h-4 w-4" />
                    {' '}
                    Add Question
                  </Button>

                  <Button onClick={() => setActiveTab('preview')}>
                    Preview Practice
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{title || 'Untitled Practice'}</CardTitle>
                      {description && <CardDescription>{description}</CardDescription>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Time Limit:
                      {' '}
                      {timeLimit}
                      {' '}
                      minutes
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className={previewMode === 'details' ? 'bg-muted' : ''}
                      onClick={() => setPreviewMode('details')}
                    >
                      Content
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={previewMode === 'questions' ? 'bg-muted' : ''}
                      onClick={() => setPreviewMode('questions')}
                    >
                      Questions
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  {previewMode === 'details'
                    ? (
                        <div className="prose dark:prose-invert max-w-none">
                          <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>{content || 'No content added yet'}</Markdown>
                        </div>
                      )
                    : (
                        <div className="space-y-8">
                          {questions.map((question, index) => (
                            <div key={index} className="space-y-4">
                              <h3 className="text-lg font-medium">
                                Question
                                {' '}
                                {index + 1}
                                {' '}
                                <span className="text-sm font-normal text-muted-foreground">
                                  (
                                  {question.questionType === 'option'
                                    ? `Multiple Choice (${question.answerType === 'single' ? 'Single Answer' : 'Multiple Answers'})`
                                    : 'Text Input'}
                                  )
                                </span>
                              </h3>
                              <div className="mb-4">
                                <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
                                  {question.content || 'No question content'}
                                </Markdown>
                              </div>

                              {/* Preview for multiple choice questions */}
                              {question.questionType === 'option' && question.options && (
                                <div className="space-y-3">
                                  {question.options.map((option, optIndex) => (
                                    <div
                                      key={optIndex}
                                      className={`flex items-center p-3 border rounded-md ${
                                        (question.answerType === 'single' && option === question.correctAnswer)
                                        || (question.answerType === 'multiple' && question.correctAnswers?.includes(option))
                                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                          : ''
                                      }`}
                                    >
                                      <div className="mr-3 text-sm font-medium text-muted-foreground">
                                        {String.fromCharCode(65 + optIndex)}
                                        .
                                      </div>
                                      <div className="flex-1">
                                        <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
                                          {option || `Option ${optIndex + 1} (empty)`}
                                        </Markdown>
                                      </div>
                                      {(question.answerType === 'single' && option === question.correctAnswer) && (
                                        <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                                          Correct Answer
                                        </div>
                                      )}
                                      {(question.answerType === 'multiple' && question.correctAnswers?.includes(option)) && (
                                        <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                                          Correct Answer
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Preview for text input questions */}
                              {question.questionType === 'text' && (
                                <div className="space-y-4">
                                  <div className="border p-3 rounded-md bg-muted/20">
                                    <p className="text-sm text-muted-foreground mb-2">Text Input Field:</p>
                                    <div className="border rounded-md p-3 min-h-[100px] bg-white dark:bg-muted"></div>
                                  </div>

                                  {question.correctAnswers && question.correctAnswers.length > 0 && (
                                    <div className="border p-3 rounded-md bg-green-50 dark:bg-green-900/20">
                                      <p className="text-sm font-medium mb-2">Acceptable Answers:</p>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {question.correctAnswers.map((answer, idx) => (
                                          <li key={idx}>{answer}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Preview explanation if available */}
                              {question.explanation && (
                                <div className="mt-4">
                                  <ExplanationCallout explanation={question.explanation} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('questions')}>
                    Back to Questions
                  </Button>
                  <Button
                    onClick={mode === 'create' ? handleCreate : handleUpdate}
                    disabled={loading}
                  >
                    {loading
                      ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {' '}
                            {mode === 'create' ? 'Creating...' : 'Updating...'}
                          </>
                        )
                      : (
                          mode === 'create' ? 'Create Practice' : 'Update Practice'
                        )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this practice?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the practice
              "
              {practiceToDelete?.title}
              " and all its associated questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                confirmDelete()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
            >
              {loading
                ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {' '}
                      Deleting...
                    </>
                  )
                : (
                    'Delete'
                  )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
