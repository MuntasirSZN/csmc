'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function HistoryBackButton() {
  const router = useRouter()

  return (
    <Button variant="outline" onClick={() => router.back()} className="cursor-pointer">
      Go Back
    </Button>
  )
}
