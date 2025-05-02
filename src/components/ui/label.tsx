// Label component extends from shadcnui - https://ui.shadcn.com/docs/components/label

'use client'
import { cn } from '@/lib/utils'
import * as LabelPrimitive from '@radix-ui/react-label'

import * as React from 'react'

function Label({ ref, className, ...props }: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { ref?: React.RefObject<React.ElementRef<typeof LabelPrimitive.Root> | null> }) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        'text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      {...props}
    />
  )
}
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
