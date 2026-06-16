'use client'

import { Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress, ProgressIndicator, ProgressTrack } from '@/components/ui/progress'
import { QuestionReviewCard } from './question-review-card'

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

interface QuestionReviewListProps {
  questions: Question[]
  answers: Record<number, string | string[]>
  activeQuestionIndex: number
  onNext: () => void
  onPrev: () => void
}

export function QuestionReviewList({
  questions,
  answers,
  activeQuestionIndex,
  onNext,
  onPrev,
}: QuestionReviewListProps) {
  const currentQuestion = questions[activeQuestionIndex]
  const userAnswer = answers[currentQuestion.id]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Question Review</span>
          <span className="text-sm font-medium">
            {activeQuestionIndex + 1}
            {' '}
            of
            {questions.length}
          </span>
        </CardTitle>
        <Progress value={((activeQuestionIndex + 1) / questions.length) * 100}><ProgressTrack className="h-2"><ProgressIndicator /></ProgressTrack></Progress>
      </CardHeader>
      <CardContent className="space-y-6">
        <QuestionReviewCard
          question={currentQuestion}
          userAnswer={userAnswer}
        />
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={activeQuestionIndex === 0}
        >
          Previous Question
        </Button>

        {activeQuestionIndex < questions.length - 1
          ? (
              <Button onClick={onNext}>
                Next Question
              </Button>
            )
          : (
              <Button render={<Link href="/practices" />} nativeButton={false}>
                <Home className="mr-2 h-4 w-4" />
                Return to Practices
              </Button>
            )}
      </CardFooter>
    </Card>
  )
}
