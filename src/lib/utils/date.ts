import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO, addDays, addWeeks, subWeeks } from 'date-fns'

export function getWeekStart(date: Date = new Date()): string {
  return format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')
}

export function getWeekEnd(date: Date = new Date()): string {
  return format(endOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')
}

export function getToday(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function isCurrentWeek(dateStr: string): boolean {
  const date = parseISO(dateStr)
  const now = new Date()
  return isWithinInterval(date, {
    start: startOfWeek(now, { weekStartsOn: 1 }),
    end: endOfWeek(now, { weekStartsOn: 1 }),
  })
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy')
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d')
}

export function getWeekDays(weekStart: string): string[] {
  const start = parseISO(weekStart)
  return Array.from({ length: 7 }, (_, i) => format(addDays(start, i), 'yyyy-MM-dd'))
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hrs > 0) return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  return `${mins}:${String(secs).padStart(2, '0')}`
}

export function formatPace(paceSecondsPerKm: number): string {
  const mins = Math.floor(paceSecondsPerKm / 60)
  const secs = Math.round(paceSecondsPerKm % 60)
  return `${mins}:${String(secs).padStart(2, '0')} /km`
}

export function getNextWeekStart(weekStart: string): string {
  return format(startOfWeek(addWeeks(parseISO(weekStart), 1), { weekStartsOn: 1 }), 'yyyy-MM-dd')
}

export function getPrevWeekStart(weekStart: string): string {
  return format(startOfWeek(subWeeks(parseISO(weekStart), 1), { weekStartsOn: 1 }), 'yyyy-MM-dd')
}

export { addWeeks, subWeeks }
