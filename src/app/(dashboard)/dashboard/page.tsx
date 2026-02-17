'use client'

import { useState } from 'react'
import { useDailyLogs, useWeeklyLogs } from '@/lib/hooks/use-daily-logs'
import { useWeeklyGoals } from '@/lib/hooks/use-goals'
import { WeekSelector } from '@/components/ui/week-selector'
import { Flame, TrendingUp, Target, Calendar } from 'lucide-react'
import { getToday, formatShortDate, getWeekStart } from '@/lib/utils/date'
import { WeeklyProgressChart } from '@/components/charts/weekly-progress-chart'
import { StatCard } from '@/components/dashboard/stat-card'
import { StreakBanner } from '@/components/dashboard/streak-banner'
import { GoalsProgress } from '@/components/dashboard/goals-progress'
import { ExerciseBreakdown } from '@/components/dashboard/exercise-breakdown'
import { TodayActivity } from '@/components/dashboard/today-activity'
import { QuickLogDialog, QuickLogFAB } from '@/components/dashboard/quick-log-dialog'

export default function DashboardPage() {
  const [selectedWeek, setSelectedWeek] = useState(getWeekStart())
  const [quickLogOpen, setQuickLogOpen] = useState(false)
  const { data: todayLogs, isLoading: logsLoading } = useDailyLogs()
  const { data: weeklyLogs } = useWeeklyLogs(selectedWeek)
  const { data: goals } = useWeeklyGoals(selectedWeek)

  const todayTotal = todayLogs?.reduce((sum, l) => sum + l.reps * l.sets, 0) || 0
  const weeklyTotal = weeklyLogs?.reduce((sum, l) => sum + l.reps * l.sets, 0) || 0
  const totalGoalReps = goals?.reduce((sum, g) => sum + g.target_reps, 0) || 0
  const goalsProgress = totalGoalReps > 0 ? Math.round((weeklyTotal / totalGoalReps) * 100) : 0
  const exercisesWorked = new Set(todayLogs?.map((l) => l.exercise_id) || []).size

  // Cast logs to component-expected types
  const typedGoals = (goals || []).map((g) => ({
    id: g.id,
    exercise_id: g.exercise_id,
    target_reps: g.target_reps,
    exercise: (g as unknown as { exercise: { name: string } }).exercise,
  }))

  const typedTodayLogs = (todayLogs || []).map((l) => {
    const ex = (l as unknown as { exercise: { name: string; slug: string; muscle_group: { name: string; slug: string } } }).exercise
    return {
      ...l,
      exercise: ex,
    }
  })

  const typedWeeklyLogs = (weeklyLogs || []).map((l) => {
    const ex = (l as unknown as { exercise: { name: string; slug: string; muscle_group: { name: string; slug: string } } }).exercise
    return {
      ...l,
      exercise: ex,
    }
  })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">{formatShortDate(getToday())}</p>
        </div>
        <WeekSelector weekStart={selectedWeek} onChange={setSelectedWeek} />
      </div>

      {/* Streak Banner */}
      <StreakBanner />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Today's Reps" value={todayTotal} icon={Flame} color="emerald" />
        <StatCard label="Weekly Reps" value={weeklyTotal} icon={TrendingUp} color="blue" />
        <StatCard label="Goal Progress" value={goalsProgress} icon={Target} color="amber" suffix="%" />
        <StatCard label="Exercises Today" value={exercisesWorked} icon={Calendar} color="violet" />
      </div>

      {/* Goals + Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GoalsProgress
          goals={typedGoals}
          weeklyLogs={typedWeeklyLogs}
          overallProgress={goalsProgress}
        />
        <ExerciseBreakdown
          todayLogs={typedTodayLogs}
          weeklyLogs={typedWeeklyLogs}
        />
      </div>

      {/* Weekly Chart */}
      <WeeklyProgressChart
        logs={weeklyLogs || []}
        weekStart={selectedWeek}
        totalGoalReps={totalGoalReps}
      />

      {/* Today's Activity */}
      <TodayActivity
        logs={typedTodayLogs}
        isLoading={logsLoading}
        onQuickLog={() => setQuickLogOpen(true)}
      />

      {/* Quick Log */}
      <QuickLogDialog open={quickLogOpen} onOpenChange={setQuickLogOpen} />
      <QuickLogFAB onClick={() => setQuickLogOpen(true)} />
    </div>
  )
}
