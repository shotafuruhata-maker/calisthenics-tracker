'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getWeekStart, getWeekDays } from '@/lib/utils/date'
import { format, parseISO } from 'date-fns'

interface Log {
  log_date: string
  reps: number
  sets: number
}

export function WeeklyProgressChart({ logs }: { logs: Log[] }) {
  const weekDays = getWeekDays(getWeekStart())

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
        <CardTitle className="text-lg">This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="reps" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
