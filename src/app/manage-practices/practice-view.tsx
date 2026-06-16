'use client'

import type { Practice } from './practice-types'
import { Pencil, Trash2 } from 'lucide-react'
import Markdown from 'react-markdown'
import { ExplanationCallout } from '@/components/explanation-callout'
import { rehypePlugins, remarkPlugins } from '@/components/markdown-plugins'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface PracticeViewProps {
  practice: Practice
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
}

export function PracticeView({ practice, onBack, onEdit, onDelete }: PracticeViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          Back to List
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            {' '}
            Edit
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={onDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {' '}
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{practice.title}</CardTitle>
          {practice.description && (
            <CardDescription>{practice.description}</CardDescription>
          )}
          <div className="text-sm text-muted-foreground mt-2">
            Time Limit:
            {' '}
            {practice.timeLimit}
            {' '}
            minutes
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Practice Content</h3>
            <div className="prose dark:prose-invert max-w-none border p-4 rounded-md bg-muted/20">
              <Markdown
                remarkPlugins={remarkPlugins}
                rehypePlugins={rehypePlugins}
              >
                {practice.content || 'No content'}
              </Markdown>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Questions</h3>
            <div className="space-y-6">
              {practice.questions && practice.questions.length > 0
                ? (
                    practice.questions.map((question, index) => (
                      <div
                        key={`question-${question.order}-${question.content}`}
                        className="border rounded-md p-4 bg-muted/20"
                      >
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
                          <Markdown
                            remarkPlugins={remarkPlugins}
                            rehypePlugins={rehypePlugins}
                          >
                            {question.content}
                          </Markdown>
                        </div>

                        {/* Show options for multiple choice questions */}
                        {question.questionType === 'option' && question.options && (
                          <div className="space-y-2 mb-4">
                            <h5 className="text-sm font-medium">Options:</h5>
                            {question.options.map((option, optIndex) => (
                              <div
                                key={`${question.content}-option-${option}`}
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
                                  <Markdown
                                    remarkPlugins={remarkPlugins}
                                    rehypePlugins={rehypePlugins}
                                  >
                                    {option}
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

                        {/* Show acceptable answers for text input questions */}
                        {question.questionType === 'text' && question.correctAnswers && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium mb-2">
                              Acceptable Answers:
                            </h5>
                            <div className="p-2 border rounded-md bg-green-50 dark:bg-green-900/20">
                              <ul className="list-disc pl-5 space-y-1">
                                {question.correctAnswers.map(answer => (
                                  <li key={`${question.content}-answer-${answer}`}>{answer}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Explanation if available */}
                        {question.explanation && (
                          <div className="mt-4">
                            <h5 className="text-sm font-medium mb-2">
                              Explanation:
                            </h5>
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
  )
}
