'use client'

import type { FormAction, Question } from './practice-types'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ExplanationCallout } from '@/components/explanation-callout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { OptionsEditor } from './options-editor'
import { QuestionTypeSelector } from './question-type-selector'

interface QuestionCardProps {
  question: Question
  questionIndex: number
  questions: Question[]
  dispatchForm: (action: FormAction) => void
}

export function QuestionCard({
  question,
  questionIndex,
  questions,
  dispatchForm,
}: QuestionCardProps) {
  const removeQuestion = (indexToRemove: number) => {
    if (questions.length <= 1) {
      toast.error('At least one question is required')
      return
    }

    dispatchForm({
      type: 'SET_QUESTIONS',
      questions: questions.reduce<Question[]>((acc, q, i) => {
        if (i !== indexToRemove) {
          acc.push({ ...q, order: acc.length })
        }
        return acc
      }, []),
    })
  }

  const updateQuestion = (index: number, field: keyof Question, value: unknown) => {
    const updatedQuestions = [...questions]

    if (field === 'questionType') {
      if (value === 'text') {
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          questionType: value as 'text',
          correctAnswer: undefined,
          correctAnswers: updatedQuestions[index].correctAnswers || [],
          options: undefined,
        }
      }
      else {
        if (updatedQuestions[index].answerType === 'single') {
          updatedQuestions[index] = {
            ...updatedQuestions[index],
            questionType: 'option',
            correctAnswer: undefined,
            correctAnswers: undefined,
            options: ['', '', '', ''],
          }
        }
        else {
          updatedQuestions[index] = {
            ...updatedQuestions[index],
            questionType: 'option',
            correctAnswer: undefined,
            correctAnswers: [],
            options: ['', '', '', ''],
          }
        }
      }
    }
    else if (field === 'answerType') {
      if (value === 'single') {
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          answerType: 'single',
          correctAnswer: '',
          correctAnswers: undefined,
        }
      }
      else {
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          answerType: 'multiple',
          correctAnswer: undefined,
          correctAnswers: [],
        }
      }
    }
    else {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
      }
    }

    dispatchForm({ type: 'SET_QUESTIONS', questions: updatedQuestions })
  }

  const updateCorrectAnswers = (answers: string[]) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      correctAnswers: answers,
    }
    dispatchForm({ type: 'SET_QUESTIONS', questions: updatedQuestions })
  }

  return (
    <Card>
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
        <QuestionTypeSelector
          question={question}
          questionIndex={questionIndex}
          onUpdate={updateQuestion}
        />

        <div className="space-y-2">
          <Label>
            Question Content (supports Markdown with LaTex math)
            <span className="ml-2 text-xs text-muted-foreground">
              Use $ symbols for inline math or $$ for display math
            </span>
          </Label>
          <Textarea
            value={question.content}
            onChange={e =>
              updateQuestion(questionIndex, 'content', e.target.value)}
            placeholder="Enter the question content"
            rows={3}
          />
        </div>

        {/* Options for Multiple Choice Questions */}
        {question.questionType === 'option' && (
          <OptionsEditor
            question={question}
            questionIndex={questionIndex}
            questions={questions}
            dispatchForm={dispatchForm}
          />
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
                updateCorrectAnswers(answers)
              }}
              placeholder="Enter acceptable answers, one per line"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Enter all possible correct answers. The system will
              match exact answers.
            </p>
          </div>
        )}

        {/* Explanation Field */}
        <div className="space-y-2">
          <Label>Explanation (optional)</Label>
          <Textarea
            value={question.explanation || ''}
            onChange={e =>
              updateQuestion(questionIndex, 'explanation', e.target.value)}
            placeholder="Explain the correct answer or solution approach"
            rows={4}
          />
        </div>

        {/* Explanation Preview */}
        {question.explanation && (
          <div className="mt-2 border p-3 rounded-md">
            <p className="text-sm font-medium mb-2">
              Explanation Preview:
            </p>
            <ExplanationCallout explanation={question.explanation} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
