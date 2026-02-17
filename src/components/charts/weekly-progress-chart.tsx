'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { getWeekDays } from '@/lib/utils/date'
import { format, parseISO } from 'date-fns'

interface Log {
  log_date: string
  reps: number
  sets: number
}

interface WeeklyProgressChartProps {
  logs: Log[]
  weekStart: string
  totalGoalReps?: number
}

export function WeeklyProgressChart({ logs, weekStart, totalGoalReps = 0 }: WeeklyProgressChartProps) {
  const weekDays = getWeekDays(weekStart)

  const weekStartDate = parseISO(weekStart)
  const weekEndDate = parseISO(weekDays[6])
  const title = `${format(weekStartDate, 'MMM d')} — ${format(weekEndDate, 'MMM d')}`

  const dailyGoal = totalGoalReps > 0 ? Math.round(totalGoalReps / 7) : 0

  const data = weekDays.map((day) => {
    const dayLogs = logs.filter((l) => l.log_date === day)
    const total = dayLogs.reduce((sum, l) => sum + l.reps * l.sets, 0)
    return {
      day: format(parseISO(day), 'EEE'),
      reps: total,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <defs>
                <linearGradient id="repsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="day" fontSize={12} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis fontSize={12} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))',
                }}
              />
              {dailyGoal > 0 && (
                <ReferenceLine
                  y={dailyGoal}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="6 4"
                  label={{
                    value: `Goal: ${dailyGoal}/day`,
                    position: 'insideTopRight',
                    fontSize: 11,
                    fill: 'hsl(var(--muted-foreground))',
                  }}
                />
              )}
              <Bar dataKey="reps" fill="url(#repsGradient)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
