'use client'

import type { Question } from './practice-types'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface QuestionTypeSelectorProps {
  question: Question
  questionIndex: number
  onUpdate: (index: number, field: keyof Question, value: unknown) => void
}

export function QuestionTypeSelector({
  question,
  questionIndex,
  onUpdate,
}: QuestionTypeSelectorProps) {
  return (
    <>
      <div className="space-y-2">
        <Label>Question Type</Label>
        <RadioGroup
          value={question.questionType}
          onValueChange={value =>
            onUpdate(questionIndex, 'questionType', value)}
          className="flex flex-row space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="option"
              id={`question-type-option-${questionIndex}`}
            />
            <Label htmlFor={`question-type-option-${questionIndex}`}>
              Multiple Choice
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="text"
              id={`question-type-text-${questionIndex}`}
            />
            <Label htmlFor={`question-type-text-${questionIndex}`}>
              Text Input
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Answer Type Selection (only for option questions) */}
      {question.questionType === 'option' && (
        <div className="space-y-2">
          <Label>Answer Type</Label>
          <RadioGroup
            value={question.answerType}
            onValueChange={value =>
              onUpdate(questionIndex, 'answerType', value)}
            className="flex flex-row space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="single"
                id={`answer-type-single-${questionIndex}`}
              />
              <Label htmlFor={`answer-type-single-${questionIndex}`}>
                Single Answer
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="multiple"
                id={`answer-type-multiple-${questionIndex}`}
              />
              <Label htmlFor={`answer-type-multiple-${questionIndex}`}>
                Multiple Answers
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </>
  )
}
