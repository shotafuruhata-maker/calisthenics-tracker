'use client'

import { useStreak } from '@/lib/hooks/use-daily-logs'
import { useProfile } from '@/lib/hooks/use-auth'
import { Flame } from 'lucide-react'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function getMotivation(streak: number): string {
  if (streak === 0) return "Start your streak today!"
  if (streak < 3) return "You're building momentum!"
  if (streak < 7) return "Great consistency this week!"
  if (streak < 14) return "Incredible discipline!"
  return "Unstoppable! Keep crushing it!"
}

export function StreakBanner() {
  const { data: streak = 0 } = useStreak()
  const { profile } = useProfile()
  const name = profile?.display_name || profile?.username || ''

  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          {getGreeting()}{name ? `, ${name}` : ''}!
        </h2>
        <p className="text-sm text-muted-foreground">{getMotivation(streak)}</p>
      </div>
      {streak > 0 && (
        <div className="flex items-center gap-2 rounded-full bg-orange-100 dark:bg-orange-950 px-4 py-2">
          <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
          <span className="font-bold text-orange-600 dark:text-orange-400 tabular-nums">{streak}</span>
          <span className="text-sm text-orange-600 dark:text-orange-400">day{streak !== 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  )
}
