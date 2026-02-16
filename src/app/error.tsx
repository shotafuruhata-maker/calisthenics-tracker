'use client'

import { useEffect } from 'react'
import { Dumbbell } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Dumbbell className="h-16 w-16 text-muted-foreground/50 mb-6" />
      <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">An unexpected error occurred. Please try again.</p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  )
}
