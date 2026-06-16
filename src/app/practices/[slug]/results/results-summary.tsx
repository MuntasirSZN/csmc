'use client'

import { BarChart2, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress, ProgressIndicator, ProgressTrack } from '@/components/ui/progress'

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

interface ResultsSummaryProps {
  score: number
  totalQuestions: number
  timeSpent: number
  percentageScore: number
}

export function ResultsSummary({ score, totalQuestions, timeSpent, percentageScore }: ResultsSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-center">Your Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="text-4xl font-bold text-primary">
            {score}
            {' '}
            /
            {totalQuestions}
            {' '}
            (
            {percentageScore.toFixed(0)}
            %)
          </div>
        </div>
        <Progress value={percentageScore}><ProgressTrack className="h-3"><ProgressIndicator /></ProgressTrack></Progress>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
            <div className="flex items-center text-xl font-semibold">
              <BarChart2 className="mr-2 h-5 w-5 text-primary" />
              {score}
              {' '}
              /
              {totalQuestions}
            </div>
            <p className="text-sm text-muted-foreground">Score</p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
            <div className="flex items-center text-xl font-semibold">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              {formatTime(timeSpent)}
            </div>
            <p className="text-sm text-muted-foreground">Time Spent</p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
            <div className="flex items-center text-xl font-semibold">
              {percentageScore >= 70
                ? (
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                  )
                : (
                    <XCircle className="mr-2 h-5 w-5 text-red-500" />
                  )}
              {percentageScore >= 70 ? 'Passed' : 'Try Again'}
            </div>
            <p className="text-sm text-muted-foreground">
              {percentageScore >= 70 ? 'Well done!' : 'Keep practicing'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
