'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Practice {
  id: number
  title: string
  slug: string
  description: string | null
  timeLimit: number
  createdAt: string
}

export default function PracticesPage() {
  const [practices, setPractices] = useState<Practice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPractices = async () => {
      try {
        const response = await fetch('/api/practices')
        if (!response.ok) {
          throw new Error('Failed to fetch practices')
        }
        const data = await response.json()
        setPractices(data)
      }
      catch (error) {
        console.error('Error fetching practices:', error)
        toast.error('Failed to fetch practice exercises')
      }
      finally {
        setLoading(false)
      }
    }

    fetchPractices()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container py-8 pt-15 mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Practice Exercises</h1>

      {practices.length === 0
        ? (
            <div className="text-center py-8">
              <p>No practice exercises available at the moment.</p>
            </div>
          )
        : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {practices.map(practice => (
                <Link href={`/practices/${practice.slug}`} key={practice.id} className="block">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>{practice.title}</CardTitle>
                      <CardDescription>
                        {practice.description || 'No description available'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        Time limit:
                        {' '}
                        {practice.timeLimit}
                        {' '}
                        minutes
                      </div>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground">
                      Added
                      {' '}
                      {formatDistanceToNow(new Date(practice.createdAt), { addSuffix: true })}
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
    </div>
  )
}
