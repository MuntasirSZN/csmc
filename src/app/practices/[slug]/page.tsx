'use client'

import { Loader2 } from 'lucide-react'
import { use } from 'react'
import { Button } from '@/components/ui/button'
import { ExistingAttemptBanner } from './existing-attempt-banner'
import { PracticeContent } from './practice-content'
import { usePractice } from './use-practice'

export default function PracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const {
    practiceData,
    ui,
    userAnswers,
    existingAttemptId,
    handleAnswerChange,
    handleSubmitButtonClick,
    handleSubmit,
    handleFinish,
    handleCloseSubmitConfirmation,
    handleCloseSummary,
    handleReturnToList,
  } = usePractice(slug)

  if (practiceData.loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!practiceData.practice) {
    return (
      <div className="container py-8 text-center mx-auto">
        <h1 className="text-2xl font-bold mb-4">Practice not found</h1>
        <p>The practice exercise you're looking for doesn't exist.</p>
        <Button className="mt-4" onClick={handleReturnToList}>
          Return to Practice List
        </Button>
      </div>
    )
  }

  if (practiceData.hasExistingAttempt) {
    return (
      <ExistingAttemptBanner
        title={practiceData.practice.title}
        description={practiceData.practice.description}
        slug={slug}
        existingAttemptId={existingAttemptId}
      />
    )
  }

  return (
    <div className="container py-6 mx-auto">
      <PracticeContent
        practice={practiceData.practice}
        timeRemaining={practiceData.timeRemaining}
        userAnswers={userAnswers}
        activeSections={ui.activeSections}
        submitting={ui.submitting}
        showSubmitConfirmation={ui.showSubmitConfirmation}
        showSummary={ui.showSummary}
        onAnswerChange={handleAnswerChange}
        onSubmitButtonClick={handleSubmitButtonClick}
        onSubmit={handleSubmit}
        onFinish={handleFinish}
        onCloseSubmitConfirmation={handleCloseSubmitConfirmation}
        onCloseSummary={handleCloseSummary}
      />
    </div>
  )
}
