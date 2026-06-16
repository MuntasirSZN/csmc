'use client'

import type { FormAction, Question } from './practice-types'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuestionCard } from './question-card'

interface QuestionEditorProps {
  questions: Question[]
  dispatchForm: (action: FormAction) => void
}

export function QuestionEditor({ questions, dispatchForm }: QuestionEditorProps) {
  const addQuestion = () => {
    dispatchForm({
      type: 'SET_QUESTIONS',
      questions: [
        ...questions,
        {
          content: '',
          options: ['', '', '', ''],
          correctAnswer: undefined,
          explanation: '',
          questionType: 'option',
          answerType: 'single',
          order: questions.length,
        },
      ],
    })
  }

  return (
    <div className="space-y-6">
      {questions.map((question, questionIndex) => (
        <QuestionCard
          key={`question-${question.order}-${question.content || 'new'}`}
          question={question}
          questionIndex={questionIndex}
          questions={questions}
          dispatchForm={dispatchForm}
        />
      ))}

      <div className="flex justify-between">
        <Button variant="outline" onClick={addQuestion}>
          <Plus className="mr-2 h-4 w-4" />
          {' '}
          Add Question
        </Button>
      </div>
    </div>
  )
}
