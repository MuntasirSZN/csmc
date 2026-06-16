'use client'

import { CheckCircle2, XCircle } from 'lucide-react'
import Markdown from 'react-markdown'
import { ExplanationCallout } from '@/components/explanation-callout'
import { rehypePlugins, remarkPlugins } from '@/components/markdown-plugins'
import { isAnswerCorrect } from '@/lib/answer-utils'

interface Question {
  id: number
  content: string
  options?: string[]
  correctAnswer?: string
  correctAnswers?: string[]
  explanation?: string
  questionType: 'option' | 'text'
  answerType: 'single' | 'multiple'
}

interface QuestionReviewCardProps {
  question: Question
  userAnswer: string | string[] | undefined
}

export function QuestionReviewCard({ question, userAnswer }: QuestionReviewCardProps) {
  const explanation = question.explanation

  // Check if the user's answer is correct
  const isCorrectAnswer = (() => {
    if (question.questionType === 'option') {
      if (question.answerType === 'single') {
        return userAnswer === question.correctAnswer
      }
      else {
        const userAnswerArray: string[] = Array.isArray(userAnswer) ? userAnswer : (userAnswer ? [userAnswer] : [])
        return (
          question.correctAnswers
          && userAnswerArray.length === question.correctAnswers.length
          && userAnswerArray.every(answer => question.correctAnswers?.includes(answer))
        )
      }
    }
    else {
      return isAnswerCorrect(userAnswer as string, question.correctAnswers)
    }
  })()

  return (
    <div className="space-y-4">
      <div className="text-left">
        <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
          {question.content}
        </Markdown>
      </div>

      {/* Multiple choice answers */}
      {question.questionType === 'option' && question.options && (
        <div className="space-y-3 mt-4">
          {question.options.map((option, i) => {
            const isUserSelected = question.answerType === 'single'
              ? userAnswer === option
              : Array.isArray(userAnswer) && userAnswer.includes(option)

            const isCorrectOption = question.answerType === 'single'
              ? question.correctAnswer === option
              : question.correctAnswers?.includes(option)

            let optionClass = 'border p-3 rounded-md'

            if (isUserSelected && isCorrectOption) {
              optionClass += ' border-green-500 bg-green-50 dark:bg-green-900/20'
            }
            else if (isUserSelected && !isCorrectOption) {
              optionClass += ' border-red-500 bg-red-50 dark:bg-red-900/20'
            }
            else if (!isUserSelected && isCorrectOption) {
              optionClass += ' border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
            }

            return (
              <div key={`question-${question.id}-option-${option}`} className={optionClass}>
                <div className="flex items-start">
                  <div className="mr-3 text-sm font-medium text-muted-foreground">
                    {String.fromCharCode(65 + i)}
                    .
                  </div>
                  <div className="flex-1">
                    <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
                      {option}
                    </Markdown>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {isUserSelected && isCorrectOption && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    {isUserSelected && !isCorrectOption && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    {!isUserSelected && isCorrectOption && (
                      <CheckCircle2 className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Text input answers */}
      {question.questionType === 'text' && (
        <div className="space-y-4 mt-4">
          <div className="border p-4 rounded-md">
            <div className="text-sm font-medium mb-2">Your Answer:</div>
            <div className={`p-2 rounded-md ${isCorrectAnswer ? 'bg-green-50 border-green-200 dark:bg-green-900/20' : 'bg-red-50 border-red-200 dark:bg-red-900/20'}`}>
              {userAnswer ? userAnswer.toString() : 'No answer provided'}
            </div>
            {!isCorrectAnswer && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Acceptable Answers:</div>
                <div className="p-2 bg-yellow-50 border-yellow-200 rounded-md dark:bg-yellow-900/20">
                  <ul className="list-disc pl-4 space-y-1">
                    {question.correctAnswers?.map(answer => (
                      <li key={`question-${question.id}-correct-${answer}`}>{answer}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <div className="mt-6">
          <ExplanationCallout explanation={explanation} />
        </div>
      )}
    </div>
  )
}
