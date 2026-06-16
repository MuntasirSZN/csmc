'use client'

import type { FormAction, FormState } from './practice-types'
import { Loader2 } from 'lucide-react'
import Markdown from 'react-markdown'
import { ExplanationCallout } from '@/components/explanation-callout'
import { rehypePlugins, remarkPlugins } from '@/components/markdown-plugins'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { QuestionEditor } from './question-editor'

interface PracticeFormProps {
  mode: 'create' | 'edit'
  formState: FormState
  dispatchForm: (action: FormAction) => void
  loading: boolean
  onBack: () => void
  onSubmit: () => void
}

export function PracticeForm({ mode, formState, dispatchForm, loading, onBack, onSubmit }: PracticeFormProps) {
  const { title, description, content, timeLimit, questions, activeTab, previewMode } = formState

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          Back to List
        </Button>
        <h2 className="text-xl font-semibold">
          {mode === 'create' ? 'Create New Practice' : 'Edit Practice'}
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={val => dispatchForm({ type: 'SET_ACTIVE_TAB', tab: val })}>
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
              <CardDescription>
                Enter basic information about this practice exercise.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={e => dispatchForm({ type: 'SET_TITLE', title: e.target.value })}
                  placeholder="e.g., Algebra Basics Practice"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={e => dispatchForm({ type: 'SET_DESCRIPTION', description: e.target.value })}
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
                  onChange={e => dispatchForm({ type: 'SET_CONTENT', content: e.target.value })}
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
                  onChange={e =>
                    dispatchForm({ type: 'SET_TIME_LIMIT', timeLimit: Number.parseInt(e.target.value) || 1 })}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button onClick={() => dispatchForm({ type: 'SET_ACTIVE_TAB', tab: 'questions' })}>
                Continue to Questions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions">
          <QuestionEditor questions={questions} dispatchForm={dispatchForm} />
          <div className="flex justify-end mt-4">
            <Button onClick={() => dispatchForm({ type: 'SET_ACTIVE_TAB', tab: 'preview' })}>
              Preview Practice
            </Button>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{title || 'Untitled Practice'}</CardTitle>
                  {description && (
                    <CardDescription>{description}</CardDescription>
                  )}
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
                  onClick={() => dispatchForm({ type: 'SET_PREVIEW_MODE', mode: 'details' })}
                >
                  Content
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={previewMode === 'questions' ? 'bg-muted' : ''}
                  onClick={() => dispatchForm({ type: 'SET_PREVIEW_MODE', mode: 'questions' })}
                >
                  Questions
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {previewMode === 'details'
                ? (
                    <div className="prose dark:prose-invert max-w-none">
                      <Markdown
                        remarkPlugins={remarkPlugins}
                        rehypePlugins={rehypePlugins}
                      >
                        {content || 'No content added yet'}
                      </Markdown>
                    </div>
                  )
                : (
                    <div className="space-y-8">
                      {questions.map((question, index) => (
                        <div key={`preview-question-${question.order}-${question.content || 'new'}`} className="space-y-4">
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
                            <Markdown
                              remarkPlugins={remarkPlugins}
                              rehypePlugins={rehypePlugins}
                            >
                              {question.content || 'No question content'}
                            </Markdown>
                          </div>

                          {/* Preview for multiple choice questions */}
                          {question.questionType === 'option' && question.options && (
                            <div className="space-y-3">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={`preview-question-${question.order}-option-${option}`}
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
                                    <Markdown
                                      remarkPlugins={remarkPlugins}
                                      rehypePlugins={rehypePlugins}
                                    >
                                      {option || `Option ${optIndex + 1} (empty)`}
                                    </Markdown>
                                  </div>
                                  {question.answerType === 'single'
                                    && option === question.correctAnswer && (
                                    <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                                      Correct Answer
                                    </div>
                                  )}
                                  {question.answerType === 'multiple'
                                    && question.correctAnswers?.includes(option) && (
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
                                <p className="text-sm text-muted-foreground mb-2">
                                  Text Input Field:
                                </p>
                                <div className="border rounded-md p-3 min-h-[100px] bg-white dark:bg-muted"></div>
                              </div>

                              {question.correctAnswers && question.correctAnswers.length > 0 && (
                                <div className="border p-3 rounded-md bg-green-50 dark:bg-green-900/20">
                                  <p className="text-sm font-medium mb-2">
                                    Acceptable Answers:
                                  </p>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {question.correctAnswers.map(answer => (
                                      <li key={`preview-question-${question.order}-answer-${answer}`}>{answer}</li>
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
              <Button
                variant="outline"
                onClick={() => dispatchForm({ type: 'SET_ACTIVE_TAB', tab: 'questions' })}
              >
                Back to Questions
              </Button>
              <Button onClick={onSubmit} disabled={loading}>
                {loading
                  ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {' '}
                        {mode === 'create' ? 'Creating...' : 'Updating...'}
                      </>
                    )
                  : mode === 'create'
                    ? (
                        'Create Practice'
                      )
                    : (
                        'Update Practice'
                      )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
