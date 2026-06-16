'use client'

import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function ExistingAttemptBanner({
  title,
  description,
  slug,
  existingAttemptId,
}: {
  title: string
  description: string | null
  slug: string
  existingAttemptId: number | null
}) {
  const router = useRouter()

  return (
    <div className="container py-8 text-center mx-auto max-w-3xl">
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-800/50 flex flex-col items-center justify-center">
            <AlertCircle className="h-12 w-12 text-amber-600 dark:text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-400">You&apos;ve already completed this practice</h2>
            <p className="text-amber-700 dark:text-amber-400/80 mt-2 mb-6 max-w-md text-center">
              You can only attempt each practice once. View your results to see how you performed.
            </p>
            <Button onClick={() => router.push(`/practices/${slug}/results?attemptId=${existingAttemptId}`)}>
              View Your Results
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
