import { Clock } from 'lucide-react'
import { convertSecondsToTime } from '@/lib/utils'

export function TimerDisplay({ timeRemaining }: { timeRemaining: number }) {
  return (
    <div className="flex items-center gap-4 bg-muted p-2 px-4 rounded-md">
      <Clock className="h-5 w-5 text-primary" />
      <div className="text-xl font-mono">
        {convertSecondsToTime(timeRemaining)}
      </div>
    </div>
  )
}
