'use client'

/*
 * The component thats shown when any errors
 * occur.
 */

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { MoveLeft, RefreshCcw } from 'lucide-react'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="max-w-md w-full border-destructive/20 shadow-xl">
        <CardHeader className="space-y-1">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2">
            <span className="text-2xl text-destructive">!</span>
          </div>
          <CardTitle className="text-center text-2xl font-bold">Something went wrong</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            We apologize for the inconvenience. An unexpected error has occurred.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-[200px]">
            <code className="text-destructive">{error.message || 'An unknown error occurred'}</code>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                Error ID:
                {error.digest}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto cursor-pointer"
            onClick={() => window.history.back()}
          >
            <MoveLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() => reset()}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
