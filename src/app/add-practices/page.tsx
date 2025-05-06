'use client'

import { rehypePlugins, remarkPlugins } from '@/components/markdown-plugins'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Markdown from 'react-markdown'
import { toast } from 'sonner'

interface Question {
  content: string
  options: string[]
  correctAnswer: string
  order: number
}

export default function AddPracticesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('details')

  // Practice details
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [timeLimit, setTimeLimit] = useState(30)

  // Questions
  const [questions, setQuestions] = useState<Question[]>([
    { content: '', options: ['', '', '', ''], correctAnswer: '', order: 0 },
  ])

  // Preview
  const [previewMode, setPreviewMode] = useState<'details' | 'questions'>('details')

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

  const updateQuestion = (index: number, field: keyof Question, value: string | string[]) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    }
    setQuestions(updatedQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    const options = [...updatedQuestions[questionIndex].options]
    options[optionIndex] = value
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options,
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

      // Check options
      const emptyOptions = question.options.filter(option => !option.trim()).length
      if (emptyOptions > 0) {
        toast.error(`Question ${index + 1} has empty options`)
        setActiveTab('questions')
        isValid = false
        return
      }

      // Check if the correct answer is one of the options
      if (!question.correctAnswer.trim()) {
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
    })

    return isValid
  }

  const handleSubmit = async () => {
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
        options: q.options,
        correctAnswer: q.correctAnswer,
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
      router.push('/practices')
    }
    catch (error: any) {
      toast.error(error.message || 'Failed to create practice')
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8 pt-15 mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Add New Practice</h1>

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

                  <div className="space-y-3">
                    <Label>Options</Label>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={e => updateOption(questionIndex, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuestion(questionIndex, 'correctAnswer', option)}
                          className={
                            question.correctAnswer === option
                              ? 'bg-green-100 hover:bg-green-200 text-green-800'
                              : ''
                          }
                        >
                          {question.correctAnswer === option ? 'Correct ✓' : 'Set as correct'}
                        </Button>
                      </div>
                    ))}
                  </div>
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
                            {index + 1}
                          </h3>
                          <div className="mb-4">
                            <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>{question.content || 'No question content'}</Markdown>
                          </div>

                          <div className="space-y-3">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`flex items-center p-3 border rounded-md ${
                                  option === question.correctAnswer ? 'border-green-500 bg-green-50' : ''
                                }`}
                              >
                                <div className="mr-3 text-sm font-medium text-muted-foreground">
                                  {String.fromCharCode(65 + optIndex)}
                                  .
                                </div>
                                <div className="flex-1">
                                  <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>{option || `Option ${optIndex + 1} (empty)`}</Markdown>
                                </div>
                                {option === question.correctAnswer && (
                                  <div className="text-xs font-semibold text-green-600">
                                    Correct Answer
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
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
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading
                  ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {' '}
                        Creating...
                      </>
                    )
                  : (
                      'Create Practice'
                    )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
