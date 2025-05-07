'use client'

import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import Markdown from 'react-markdown'
import { rehypePlugins, remarkPlugins } from './markdown-plugins'

interface ExplanationCalloutProps {
  explanation: string
}

export function ExplanationCallout({ explanation }: ExplanationCalloutProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!explanation)
    return null

  // Format explanation for callout
  const formattedExplanation = explanation
    .split('\n')
    .map(line => `> ${line}`)
    .join('\n')

  const calloutContent = `> [!NOTE]${isOpen ? '' : '-'}\n${formattedExplanation}`

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={isOpen}
      >
        {isOpen
          ? (
              <ChevronDown className="mr-1 h-4 w-4" />
            )
          : (
              <ChevronRight className="mr-1 h-4 w-4" />
            )}
        Show Explanation
      </button>
      <div className="mt-2">
        <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
          {calloutContent}
        </Markdown>
      </div>
    </div>
  )
}
