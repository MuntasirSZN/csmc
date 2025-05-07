'use client'

import { ExplanationCallout } from '@/components/explanation-callout'
import { rehypePlugins, remarkPlugins } from '@/components/markdown-plugins'
import { Textarea } from '@/components/ui/textarea'
import Markdown from 'react-markdown'

interface TextQuestionProps {
  question: {
    id: number
    content: string
    explanation?: string
  }
  userAnswer: string
  onAnswerChange: (questionId: number, answer: string) => void
}

export function TextQuestion({ question, userAnswer, onAnswerChange }: TextQuestionProps) {
  const { id, content, explanation } = question

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onAnswerChange(id, e.target.value)
  }

  return (
    <div className="space-y-4">
      <div className="text-left mb-4">
        <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
          {content}
        </Markdown>
      </div>

      <Textarea
        value={userAnswer || ''}
        onChange={handleAnswerChange}
        placeholder="Type your answer here..."
        className="min-h-[150px]"
      />

      <ExplanationCallout explanation={explanation || ''} />
    </div>
  )
}
