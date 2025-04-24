'use client'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { useEffect, useState } from 'react'
import { cn } from '../../lib/cn'

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

function CollapsibleContent({ ref, children, ...props }: React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent> & { ref?: React.RefObject<HTMLDivElement | null> }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <CollapsiblePrimitive.CollapsibleContent
      ref={ref}
      {...props}
      className={cn(
        'overflow-hidden',
        mounted
        && 'data-[state=closed]:animate-fd-collapsible-up data-[state=open]:animate-fd-collapsible-down',
        props.className,
      )}
    >
      {children}
    </CollapsiblePrimitive.CollapsibleContent>
  )
}

CollapsibleContent.displayName
  = CollapsiblePrimitive.CollapsibleContent.displayName

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
