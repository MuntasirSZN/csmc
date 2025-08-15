'use client'

import Markdown from 'react-markdown'
import { ExplanationCallout } from '@/components/explanation-callout'
import { rehypePlugins, remarkPlugins } from '@/components/markdown-plugins'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface OptionQuestionProps {
  question: {
    id: number
    content: string
    options: string[]
    explanation?: string
    answerType: 'single' | 'multiple'
  }
  userAnswer: string | string[]
  onAnswerChange: (questionId: number, answer: string | string[]) => void
}

export function OptionQuestion({ question, userAnswer, onAnswerChange }: OptionQuestionProps) {
  const { id, content, options, explanation, answerType } = question

  const handleSingleAnswerChange = (value: string) => {
    onAnswerChange(id, value)
  }

  const handleMultipleAnswerChange = (option: string, checked: boolean) => {
    const currentAnswers = Array.isArray(userAnswer) ? userAnswer : []
    let newAnswers: string[]

    if (checked) {
      newAnswers = [...currentAnswers, option]
    }
    else {
      newAnswers = currentAnswers.filter(a => a !== option)
    }

    onAnswerChange(id, newAnswers)
  }

  return (
    <div className="space-y-4">
      <div className="text-left mb-4">
        <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
          {content}
        </Markdown>
      </div>

      {answerType === 'single'
        ? (
            <RadioGroup
              value={Array.isArray(userAnswer) ? '' : (userAnswer || '')}
              onValueChange={handleSingleAnswerChange}
              className="space-y-4 text-left"
            >
              {options.map((option, i) => (
                <div key={`${id}-option-${option.slice(0, 20).replace(/\s+/g, '')}`} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50">
                  <RadioGroupItem value={option} id={`option-${id}-${i}`} />
                  <Label htmlFor={`option-${id}-${i}`} className="flex-1 cursor-pointer">
                    <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>{option}</Markdown>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )
        : (
            <div className="space-y-4 text-left">
              {options.map((option, i) => {
                const currentAnswers = Array.isArray(userAnswer) ? userAnswer : []
                const isChecked = currentAnswers.includes(option)

                return (
                  <div key={`${id}-checkbox-${option.slice(0, 20).replace(/\s+/g, '')}`} className="flex items-start space-x-2 border p-3 rounded-md hover:bg-muted/50">
                    <Checkbox
                      id={`option-${id}-${i}`}
                      checked={isChecked}
                      onCheckedChange={checked => handleMultipleAnswerChange(option, checked === true)}
                      className="mt-1"
                    />
                    <Label htmlFor={`option-${id}-${i}`} className="flex-1 cursor-pointer">
                      <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>{option}</Markdown>
                    </Label>
                  </div>
                )
              })}
            </div>
          )}

      <ExplanationCallout explanation={explanation || ''} />
    </div>
  )
}
