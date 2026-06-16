'use client'

import Markdown from 'react-markdown'
import { rehypePlugins, remarkPlugins } from '@/components/markdown-plugins'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'

interface Question {
  id: number
  content: string
  options?: string[]
  order: number
  explanation?: string
  questionType: 'option' | 'text'
  answerType: 'single' | 'multiple'
}

export function QuestionSection({
  question,
  index,
  userAnswers,
  activeSections,
  onAnswerChange,
}: {
  question: Question
  index: number
  userAnswers: Record<number, string | string[]>
  activeSections: Record<number, boolean>
  onAnswerChange: (questionId: number, answer: string | string[]) => void
}) {
  return (
    <div
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
              onValueChange={value => onAnswerChange(question.id, value)}
              className="space-y-4"
            >
              {question.options?.map(option => (
                <div key={`${question.id}-${option}`} className="flex items-center space-x-3 border p-4 rounded-md hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option} id={`question-${question.id}-option-${option}`} />
                  <Label
                    htmlFor={`question-${question.id}-option-${option}`}
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
            {question.options?.map((option) => {
              // FIXED: Multiple choice selection bug
              const currentAnswers = Array.isArray(userAnswers[question.id])
                ? [...userAnswers[question.id] as string[]]
                : []

              // Create a unique ID for each checkbox to prevent selection issues
              const optionId = `question-${question.id}-option-${option}`

              return (
                <div key={`${question.id}-${option}`} className="flex items-start space-x-3 border p-4 rounded-md hover:bg-muted/50 transition-colors">
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
                      onAnswerChange(question.id, newAnswers)
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
            onChange={e => onAnswerChange(question.id, e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[150px] w-full"
          />
        </div>
      )}
    </div>
  )
}
