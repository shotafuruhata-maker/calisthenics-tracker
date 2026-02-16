'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatShortDate, getWeekStart, getNextWeekStart, getPrevWeekStart } from '@/lib/utils/date'

interface WeekSelectorProps {
  weekStart: string
  onChange: (weekStart: string) => void
}

export function WeekSelector({ weekStart, onChange }: WeekSelectorProps) {
  const currentWeekStart = getWeekStart()
  const isCurrentWeek = weekStart === currentWeekStart

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onChange(getPrevWeekStart(weekStart))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium min-w-[120px] text-center">
        Week of {formatShortDate(weekStart)}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onChange(getNextWeekStart(weekStart))}
        disabled={isCurrentWeek}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
