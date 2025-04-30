'use client'

import { Button } from '@/components/ui/button'

export default function HistoryBackButton() {
  return (
    <Button variant="outline" onClick={() => window.history.back()} className="cursor-pointer">
      Back
    </Button>
  )
}
