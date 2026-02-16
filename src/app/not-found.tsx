import Link from 'next/link'
import { Dumbbell } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Dumbbell className="h-16 w-16 text-muted-foreground/50 mb-6" />
      <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
      <p className="text-muted-foreground mb-6">Page not found. Looks like you skipped this rep.</p>
      <Link
        href="/dashboard"
        className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
