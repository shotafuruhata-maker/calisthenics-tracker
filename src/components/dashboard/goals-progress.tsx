'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Target, CheckCircle2, Plus } from 'lucide-react'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import Link from 'next/link'

interface Goal {
  id: string
  exercise_id: string
  target_reps: number
  exercise: { name: string }
}

interface Log {
  exercise_id: string
  reps: number
  sets: number
}

interface GoalsProgressProps {
  goals: Goal[]
  weeklyLogs: Log[]
  overallProgress: number
}

function getProgressColor(pct: number) {
  if (pct >= 75) return 'bg-emerald-500'
  if (pct >= 25) return 'bg-amber-500'
  return 'bg-gray-400'
}

export function GoalsProgress({ goals, weeklyLogs, overallProgress }: GoalsProgressProps) {
  const radialData = [
    { name: 'progress', value: Math.min(overallProgress, 100), fill: '#10b981' },
  ]

  if (!goals.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Target className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">No goals set this week</p>
            <Button asChild size="sm" variant="outline">
              <Link href="/goals">Set your first goal</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Weekly Goals</CardTitle>
          {goals.length < 3 && (
            <Button asChild size="xs" variant="ghost">
              <Link href="/goals"><Plus className="h-4 w-4" /> Add Goal</Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 mb-4">
          <div className="h-[120px] w-[120px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
                data={radialData}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  background={{ fill: 'hsl(var(--muted))' }}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground text-xl font-bold"
                >
                  {overallProgress}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3">
            {goals.map((goal) => {
              const logged = weeklyLogs
                .filter((l) => l.exercise_id === goal.exercise_id)
                .reduce((sum, l) => sum + l.reps * l.sets, 0)
              const pct = Math.min(100, Math.round((logged / goal.target_reps) * 100))
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{goal.exercise?.name || 'Exercise'}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      {logged}/{goal.target_reps}
                      {pct >= 100 && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                    </span>
                  </div>
                  <Progress value={pct} className={`h-2 [&>[data-slot=progress-indicator]]:${getProgressColor(pct)}`} />
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
