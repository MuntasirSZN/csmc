'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Question {
  id: number
  content: string
  options?: string[]
  order: number
  explanation?: string
  questionType: 'option' | 'text'
  answerType: 'single' | 'multiple'
}

export function SubmitDialog({
  open,
  onClose,
  questions,
  userAnswers,
  answeredCount,
  totalQuestions,
  submitting,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  questions: Question[]
  userAnswers: Record<number, string | string[]>
  answeredCount: number
  totalQuestions: number
  submitting: boolean
  onSubmit: () => void
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open)
          onClose()
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Practice Attempt</DialogTitle>
          <DialogDescription>
            Are you sure you want to submit your answers? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 py-4">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="flex flex-col items-center"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  userAnswers[question.id]
                    ? 'bg-primary/20 text-primary'
                    : 'bg-destructive/20 text-destructive'
                }`}
              >
                {index + 1}
              </div>
              <Checkbox
                checked={!!userAnswers[question.id]}
                className="mt-1"
                disabled
              />
            </div>
          ))}
        </div>

        <div className="py-2 text-center">
          <p className="text-sm text-muted-foreground">
            You have answered
            {' '}
            {answeredCount}
            {' '}
            out of
            {' '}
            {totalQuestions}
            {' '}
            questions.
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-500 mt-2">
            Note: You can only attempt this practice once.
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting
              ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                )
              : 'Confirm Submission'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
