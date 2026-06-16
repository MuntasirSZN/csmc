'use client'

import { AlarmClock, Loader2 } from 'lucide-react'
import Markdown from 'react-markdown'
import { rehypePlugins, remarkPlugins } from '@/components/markdown-plugins'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress, ProgressIndicator, ProgressTrack } from '@/components/ui/progress'
import { QuestionSection } from './question-section'
import { SubmitDialog } from './submit-dialog'
import { SummarySection } from './summary-section'
import { TimerDisplay } from './timer-display'

interface Question {
  id: number
  content: string
  options?: string[]
  order: number
  explanation?: string
  questionType: 'option' | 'text'
  answerType: 'single' | 'multiple'
}

interface Practice {
  title: string
  description: string | null
  content: string
  questions: Question[]
}

interface PracticeContentProps {
  practice: Practice
  timeRemaining: number
  userAnswers: Record<number, string | string[]>
  activeSections: Record<number, boolean>
  submitting: boolean
  showSubmitConfirmation: boolean
  showSummary: boolean
  onAnswerChange: (questionId: number, answer: string | string[]) => void
  onSubmitButtonClick: () => void
  onSubmit: () => void
  onFinish: () => void
  onCloseSubmitConfirmation: () => void
  onCloseSummary: () => void
}

export function PracticeContent({
  practice,
  timeRemaining,
  userAnswers,
  activeSections,
  submitting,
  showSubmitConfirmation,
  showSummary,
  onAnswerChange,
  onSubmitButtonClick,
  onSubmit,
  onFinish,
  onCloseSubmitConfirmation,
  onCloseSummary,
}: PracticeContentProps) {
  const totalQuestions = practice.questions.length
  const answeredCount = Object.keys(userAnswers).length
  const progress = (answeredCount / totalQuestions) * 100

  return (
    <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
      {/* Sticky header with timer and progress */}
      <div className="sticky top-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">{practice.title}</h1>
            {practice.description && (
              <p className="text-muted-foreground mt-1">{practice.description}</p>
            )}
          </div>

          <TimerDisplay timeRemaining={timeRemaining} />
        </div>

        <div className="w-full">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">
              {answeredCount}
              &nbsp;of&nbsp;
              {totalQuestions}
              &nbsp;questions answered
            </span>
            <Button
              variant="default"
              size="sm"
              onClick={onSubmitButtonClick}
              disabled={submitting}
              className="ml-auto"
            >
              <SubmitButton submitting={submitting} />
            </Button>
          </div>
          <Progress value={progress}>
            <ProgressTrack className="h-2">
              <ProgressIndicator />
            </ProgressTrack>
          </Progress>

          {answeredCount < totalQuestions && (
            <div className="mt-3 flex items-center justify-center text-sm text-muted-foreground">
              <AlarmClock className="h-4 w-4 mr-2" />
              Don&apos;t forget to answer all questions before submitting
            </div>
          )}
        </div>
      </div>

      {/* Practice content (shown at the top) */}
      {practice.content && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
              {practice.content}
            </Markdown>
          </CardContent>
        </Card>
      )}

      {/* All questions in a scrollable view */}
      <div className="space-y-12 mb-8">
        {practice.questions.map((question, index) => (
          <QuestionSection
            key={question.id}
            question={question}
            index={index}
            userAnswers={userAnswers}
            activeSections={activeSections}
            onAnswerChange={onAnswerChange}
          />
        ))}
      </div>

      {/* Fixed submit button at bottom */}
      <div className="fixed bottom-8 right-8 z-20">
        <Button
          size="lg"
          onClick={onSubmitButtonClick}
          disabled={submitting}
          className="shadow-lg"
        >
          <SubmitButton submitting={submitting} />
        </Button>
      </div>

      <SubmitDialog
        open={showSubmitConfirmation}
        onClose={onCloseSubmitConfirmation}
        questions={practice.questions}
        userAnswers={userAnswers}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        submitting={submitting}
        onSubmit={onSubmit}
      />

      <SummarySection
        open={showSummary}
        onClose={onCloseSummary}
        questions={practice.questions}
        userAnswers={userAnswers}
        onFinish={onFinish}
      />
    </div>
  )
}

function SubmitButton({ submitting }: { submitting: boolean }) {
  if (submitting) {
    return (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {' '}
        Submitting
      </>
    )
  }
  return 'Submit All Answers'
}
