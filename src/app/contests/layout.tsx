import type { ReactNode } from 'react'
import { DocsLayout } from '@/components/layouts/docs'
import { contests_source } from '@/lib/source'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={contests_source.pageTree}
      sidebar={{
        enabled: false,
      }}
      nav={{
        enabled: false,
      }}
    >
      {children}
    </DocsLayout>
  )
}
