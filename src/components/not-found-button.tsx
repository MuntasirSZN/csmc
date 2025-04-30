'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFoundButton() {
  const router = useRouter()
  return (
    <Button variant="secondary" className="group" onClick={() => router.back()}>
      <ArrowLeft
        className="me-2 ms-0 opacity-60 transition-transform group-hover:-translate-x-0.5"
        size={16}
        strokeWidth={2}
        aria-hidden="true"
      />
      Go back
    </Button>
  )
}
