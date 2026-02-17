'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  color: 'emerald' | 'blue' | 'amber' | 'violet'
  suffix?: string
}

const colorMap = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-950', text: 'text-emerald-600 dark:text-emerald-400' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-950', text: 'text-blue-600 dark:text-blue-400' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-950', text: 'text-amber-600 dark:text-amber-400' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-950', text: 'text-violet-600 dark:text-violet-400' },
}

function useCountUp(target: number, duration = 600) {
  const [current, setCurrent] = useState(0)
  const prevTarget = useRef(0)

  useEffect(() => {
    if (target === prevTarget.current) return
    const start = prevTarget.current
    prevTarget.current = target
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(start + (target - start) * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [target, duration])

  return current
}

export function StatCard({ label, value, icon: Icon, color, suffix = '' }: StatCardProps) {
  const display = useCountUp(value)
  const colors = colorMap[color]

  return (
    <Card className="hover:scale-[1.02] transition-transform">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2 ${colors.bg}`}>
            <Icon className={`h-5 w-5 ${colors.text}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tabular-nums">
              {display.toLocaleString()}{suffix}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
