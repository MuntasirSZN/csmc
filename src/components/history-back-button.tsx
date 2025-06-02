'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function HistoryBackButton() {
  const router = useRouter()

  return (
    <Button variant="outline" onClick={() => router.back()} className="cursor-pointer">
      Go Back
    </Button>
  )
}
