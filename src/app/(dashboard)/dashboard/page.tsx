'use client'

import { useState } from 'react'
import { useDailyLogs, useWeeklyLogs } from '@/lib/hooks/use-daily-logs'
import { useWeeklyGoals } from '@/lib/hooks/use-goals'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { WeekSelector } from '@/components/ui/week-selector'
import { Target, TrendingUp, Flame, Calendar } from 'lucide-react'
import { getToday, formatShortDate, getWeekStart } from '@/lib/utils/date'
import { WeeklyProgressChart } from '@/components/charts/weekly-progress-chart'
import Link from 'next/link'

export default function DashboardPage() {
  const [selectedWeek, setSelectedWeek] = useState(getWeekStart())
  const { data: todayLogs, isLoading: logsLoading } = useDailyLogs()
  const { data: weeklyLogs } = useWeeklyLogs(selectedWeek)
  const { data: goals } = useWeeklyGoals(selectedWeek)

  const todayTotal = todayLogs?.reduce((sum, l) => sum + l.reps * l.sets, 0) || 0
  const weeklyTotal = weeklyLogs?.reduce((sum, l) => sum + l.reps * l.sets, 0) || 0
  const totalGoalReps = goals?.reduce((sum, g) => sum + g.target_reps, 0) || 0
  const goalsProgress = totalGoalReps > 0 ? Math.round((weeklyTotal / totalGoalReps) * 100) : 0
  const exercisesWorked = new Set(todayLogs?.map((l) => l.exercise_id) || []).size

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">{formatShortDate(getToday())}</p>
        </div>
        <WeekSelector weekStart={selectedWeek} onChange={setSelectedWeek} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Flame className="h-4 w-4" />
              Today&apos;s Reps
            </div>
            <p className="text-3xl font-bold">{todayTotal.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              Weekly Reps
            </div>
            <p className="text-3xl font-bold">{weeklyTotal.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Target className="h-4 w-4" />
              Goal Progress
            </div>
            <p className="text-3xl font-bold">{goalsProgress}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              Exercises Today
            </div>
            <p className="text-3xl font-bold">{exercisesWorked}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Goals Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {!goals?.length ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No goals set this week.</p>
              <Link href="/goals" className="text-emerald-600 hover:underline text-sm">
                Set your first goal
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const logged = weeklyLogs
                  ?.filter((l) => l.exercise_id === goal.exercise_id)
                  .reduce((sum, l) => sum + l.reps * l.sets, 0) || 0
                const pct = Math.min(100, Math.round((logged / goal.target_reps) * 100))
                const exercise = (goal as unknown as { exercise: { name: string } }).exercise
                return (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{exercise?.name || 'Exercise'}</span>
                      <span className="text-sm text-muted-foreground">
                        {logged} / {goal.target_reps} reps
                        {pct >= 100 && <Badge className="ml-2 bg-emerald-100 text-emerald-700">Complete!</Badge>}
                      </span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Today&apos;s Activity</CardTitle>
            <Link href="/log" className="text-sm text-emerald-600 hover:underline">
              Log more reps
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : !todayLogs?.length ? (
            <p className="text-center py-6 text-muted-foreground">No reps logged today. Time to get moving!</p>
          ) : (
            <div className="space-y-2">
              {todayLogs.map((log) => {
                const exercise = (log as unknown as { exercise: { name: string; muscle_group: { name: string } } }).exercise
                return (
                  <div key={log.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">{exercise?.name}</p>
                      <p className="text-xs text-muted-foreground">{exercise?.muscle_group?.name}</p>
                    </div>
                    <Badge variant="secondary">
                      {log.sets > 1 ? `${log.sets}x${log.reps}` : `${log.reps}`} reps
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <WeeklyProgressChart logs={weeklyLogs || []} />
    </div>
  )
}
