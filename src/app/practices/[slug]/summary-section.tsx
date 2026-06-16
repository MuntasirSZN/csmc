'use client'

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

export function SummarySection({
  open,
  onClose,
  questions,
  userAnswers,
  onFinish,
}: {
  open: boolean
  onClose: () => void
  questions: Question[]
  userAnswers: Record<number, string | string[]>
  onFinish: () => void
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
          <DialogTitle>Practice Summary</DialogTitle>
          <DialogDescription>
            You&apos;ve completed the practice. Here&apos;s a summary of your answers.
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

        <DialogFooter>
          <Button onClick={onFinish} size="lg">
            View Results
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
