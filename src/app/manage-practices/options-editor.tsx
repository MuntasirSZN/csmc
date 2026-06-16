'use client'

import type { FormAction, Question } from './practice-types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface OptionsEditorProps {
  question: Question
  questionIndex: number
  questions: Question[]
  dispatchForm: (action: FormAction) => void
}

export function OptionsEditor({
  question,
  questionIndex,
  questions,
  dispatchForm,
}: OptionsEditorProps) {
  const updateOption = (optionIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    const oldOptions = updatedQuestions[questionIndex].options || []
    const oldValue = oldOptions[optionIndex]
    const options = [...oldOptions]
    options[optionIndex] = value
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options,
    }

    const currentQuestion = updatedQuestions[questionIndex]
    if (
      currentQuestion.answerType === 'single'
      && currentQuestion.correctAnswer === oldValue
    ) {
      currentQuestion.correctAnswer = value
    }

    if (currentQuestion.answerType === 'multiple' && currentQuestion.correctAnswers) {
      if (currentQuestion.correctAnswers.includes(oldValue)) {
        currentQuestion.correctAnswers = currentQuestion.correctAnswers.map(a =>
          a === oldValue ? value : a,
        )
      }
    }

    dispatchForm({ type: 'SET_QUESTIONS', questions: updatedQuestions })
  }

  const toggleCorrectAnswer = (option: string) => {
    const updatedQuestions = [...questions]
    const updatedQuestion = { ...updatedQuestions[questionIndex] }

    if (updatedQuestion.answerType === 'multiple') {
      const correctAnswers = [...(updatedQuestion.correctAnswers || [])]
      const index = correctAnswers.indexOf(option)

      if (index >= 0) {
        correctAnswers.splice(index, 1)
      }
      else {
        correctAnswers.push(option)
      }

      updatedQuestions[questionIndex] = {
        ...updatedQuestion,
        correctAnswers,
      }
    }
    else {
      updatedQuestions[questionIndex] = {
        ...updatedQuestion,
        correctAnswer: option,
      }
    }

    dispatchForm({ type: 'SET_QUESTIONS', questions: updatedQuestions })
  }

  return (
    <div className="space-y-3">
      <Label>Options</Label>
      {question.options?.map((option, optionIndex) => (
        <div
          key={`question-${questionIndex}-option-${option}`}
          className="flex items-center space-x-2"
        >
          <Input
            value={option}
            onChange={e =>
              updateOption(optionIndex, e.target.value)}
            placeholder={`Option ${optionIndex + 1}`}
          />
          {question.answerType === 'single'
            ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    toggleCorrectAnswer(option)}
                  className={
                    question.correctAnswer
                    && question.correctAnswer === option
                      ? 'bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400'
                      : ''
                  }
                >
                  {question.correctAnswer
                    && question.correctAnswer === option
                    ? 'Correct \u2713'
                    : 'Set as correct'}
                </Button>
              )
            : (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`correct-${questionIndex}-${optionIndex}-${option.replace(/\s+/g, '-').substring(0, 10)}`}
                    checked={(question.correctAnswers || []).includes(option)}
                    onCheckedChange={(checked) => {
                      const updatedQuestions = [...questions]
                      const updatedQuestion = {
                        ...updatedQuestions[questionIndex],
                      }
                      const correctAnswers = [
                        ...(updatedQuestion.correctAnswers || []),
                      ]

                      if (checked) {
                        if (!correctAnswers.includes(option)) {
                          correctAnswers.push(option)
                        }
                      }
                      else {
                        const idx = correctAnswers.indexOf(option)
                        if (idx !== -1) {
                          correctAnswers.splice(idx, 1)
                        }
                      }

                      updatedQuestion.correctAnswers = correctAnswers
                      updatedQuestions[questionIndex] = updatedQuestion
                      dispatchForm({ type: 'SET_QUESTIONS', questions: updatedQuestions })
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
          updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            options: [
              ...(updatedQuestions[questionIndex].options || []),
              '',
            ],
          }
          dispatchForm({ type: 'SET_QUESTIONS', questions: updatedQuestions })
        }}
      >
        Add Option
      </Button>
    </div>
  )
}
