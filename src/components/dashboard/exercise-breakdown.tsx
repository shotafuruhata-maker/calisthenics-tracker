'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Dumbbell } from 'lucide-react'

interface Log {
  reps: number
  sets: number
  exercise: {
    name: string
    muscle_group: { name: string; slug: string }
  }
}

interface ExerciseBreakdownProps {
  todayLogs: Log[]
  weeklyLogs: Log[]
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#84cc16']

function aggregateByMuscleGroup(logs: Log[]) {
  const map = new Map<string, number>()
  logs.forEach((l) => {
    const group = l.exercise?.muscle_group?.name || 'Other'
    map.set(group, (map.get(group) || 0) + l.reps * l.sets)
  })
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function ExerciseBreakdown({ todayLogs, weeklyLogs }: ExerciseBreakdownProps) {
  const [tab, setTab] = useState('today')

  const todayData = aggregateByMuscleGroup(todayLogs)
  const weeklyData = aggregateByMuscleGroup(weeklyLogs)
  const data = tab === 'today' ? todayData : weeklyData
  const totalReps = data.reduce((sum, d) => sum + d.value, 0)

  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Muscle Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Dumbbell className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No exercises logged yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Muscle Groups</CardTitle>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))',
                }}
                formatter={(value) => [`${value} reps`, '']}
              />
              <text
                x="50%"
                y="48%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '1.5rem', fontWeight: 700, fill: 'hsl(var(--foreground))' }}
              >
                {totalReps}
              </text>
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '0.75rem', fill: 'hsl(var(--muted-foreground))' }}
              >
                total reps
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-3 mt-2 justify-center">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-muted-foreground">{d.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
