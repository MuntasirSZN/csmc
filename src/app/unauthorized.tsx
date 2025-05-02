import type { Metadata } from 'next'
import type React from 'react'
import HistoryBackButton from '@/components/history-back-button'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '401 Unauthorized',
  description: 'You do not have permission to access this page.',
}

interface UnauthorizedProps {
  title?: string
  description?: string
}

function Illustration(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 362 145" {...props}>
      <path
        fill="currentColor"
        d="M181 20c-22.1 0-40 17.9-40 40v20h-8c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h96c4.4 0 8-3.6 8-8V88c0-4.4-3.6-8-8-8h-8V60c0-22.1-17.9-40-40-40zm0 20c11 0 20 9 20 20v20h-40V60c0-11 9-20 20-20zm0 60c5.5 0 10 4.5 10 10s-4.5 10-10 10-10-4.5-10-10 4.5-10 10-10z"
      />
      <path
        fill="currentColor"
        d="M62.6 142c-2.133 0-3.2-1.067-3.2-3.2V118h-56c-2 0-3-1-3-3V92.8c0-1.333.4-2.733 1.2-4.2L58.2 4c.8-1.333 2.067-2 3.8-2h28c2 0 3 1 3 3v85.4h11.2c.933 0 1.733.333 2.4 1 .667.533 1 1.267 1 2.2v21.2c0 .933-.333 1.733-1 2.4-.667.533-1.467.8-2.4.8H93v20.8c0 2.133-1.067 3.2-3.2 3.2H62.6zM33 90.4h26.4V51.2L33 90.4zM316.116 142c-2.134 0-3.2-1.067-3.2-3.2V118h-56c-2 0-3-1-3-3V92.8c0-1.333.4-2.733 1.2-4.2l56.6-84.6c.8-1.333 2.066-2 3.8-2h28c2 0 3 1 3 3v85.4h11.2c.933 0 1.733.333 2.4 1 .666.533 1 1.267 1 2.2v21.2c0 .933-.334 1.733-1 2.4-.667.533-1.467.8-2.4.8h-11.2v20.8c0 2.133-1.067 3.2-3.2 3.2h-27.2zm-29.6-51.6h26.4V51.2l-26.4 39.2z"
      />
    </svg>
  )
}

function Unauthorized({
  title = 'Unauthorized',
  description = 'Access denied. You do not have permission to view this page.',
}: UnauthorizedProps) {
  return (
    <div className="relative text-center z-[1] pt-52">
      <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-primary sm:text-7xl">{title}</h1>
      <p className="mt-6 text-pretty text-lg font-medium text-muted-foreground sm:text-xl/8">{description}</p>
      <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-y-3 gap-x-6">
        <HistoryBackButton />
        <Button className="-order-1 sm:order-none" asChild>
          <Link href="/">Take me home</Link>
        </Button>
      </div>
    </div>
  )
}

export default function UnauthorizedPage() {
  return (
    <div className="relative flex flex-col w-full justify-center min-h-svh bg-background p-6 md:p-10">
      <div className="relative max-w-5xl mx-auto w-full">
        <Illustration className="absolute inset-0 w-full h-[50vh] opacity-[0.04] dark:opacity-[0.03] text-foreground" />
        <Unauthorized title="Unauthorized" description="You need to be logged in to access this page." />
      </div>
    </div>
  )
}
