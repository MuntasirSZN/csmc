'use client'

import { OptionQuestion } from './option-question'
import { TextQuestion } from './text-question'

interface Question {
  id: number
  content: string
  options?: string[]
  explanation?: string
  questionType: 'option' | 'text'
  answerType: 'single' | 'multiple'
}

interface QuestionWrapperProps {
  question: Question
  userAnswer: string | string[]
  onAnswerChange: (questionId: number, answer: string | string[]) => void
}

export function QuestionWrapper({ question, userAnswer, onAnswerChange }: QuestionWrapperProps) {
  if (question.questionType === 'text') {
    return (
      <TextQuestion
        question={question}
        userAnswer={userAnswer as string}
        onAnswerChange={onAnswerChange}
      />
    )
  }

  return (
    <OptionQuestion
      question={{
        ...question,
        options: question.options || [],
      }}
      userAnswer={userAnswer}
      onAnswerChange={onAnswerChange}
    />
  )
}
