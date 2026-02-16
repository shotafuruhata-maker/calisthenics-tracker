'use client'

import { useState } from 'react'
import { useWeeklyGoals, useSetGoal, useDeleteGoal } from '@/lib/hooks/use-goals'
import { useExercises, useMuscleGroups } from '@/lib/hooks/use-exercises'
import { useWeeklyLogs } from '@/lib/hooks/use-daily-logs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { WeekSelector } from '@/components/ui/week-selector'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Trash2, Target } from 'lucide-react'
import { toast } from 'sonner'
import { getWeekStart } from '@/lib/utils/date'

export default function GoalsPage() {
  const [selectedWeek, setSelectedWeek] = useState(getWeekStart())
  const { data: goals, isLoading } = useWeeklyGoals(selectedWeek)
  const { data: weeklyLogs } = useWeeklyLogs(selectedWeek)
  const { data: exercises } = useExercises()
  const { data: muscleGroups } = useMuscleGroups()
  const setGoal = useSetGoal()
  const deleteGoal = useDeleteGoal()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState('')
  const [targetReps, setTargetReps] = useState('')
  const [filterMuscle, setFilterMuscle] = useState('')

  const handleAddGoal = async () => {
    if (!selectedExercise || !targetReps) return
    try {
      await setGoal.mutateAsync({
        exerciseId: selectedExercise,
        targetReps: parseInt(targetReps),
        weekStart: selectedWeek,
      })
      toast.success('Goal set!')
      setDialogOpen(false)
      setSelectedExercise('')
      setTargetReps('')
    } catch {
      toast.error('Failed to set goal')
    }
  }

  const handleDelete = async (goalId: string) => {
    try {
      await deleteGoal.mutateAsync(goalId)
      toast.success('Goal removed')
    } catch {
      toast.error('Failed to remove goal')
    }
  }

  const existingExerciseIds = new Set(goals?.map((g) => g.exercise_id) || [])
  const availableExercises = exercises?.filter(
    (e) => !existingExerciseIds.has(e.id) && (!filterMuscle || (e as unknown as { muscle_group: { slug: string } }).muscle_group?.slug === filterMuscle)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Weekly Goals</h1>
        </div>
        <div className="flex items-center gap-3">
          <WeekSelector weekStart={selectedWeek} onChange={setSelectedWeek} />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Set Weekly Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Filter by muscle group</Label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                    value={filterMuscle}
                    onChange={(e) => setFilterMuscle(e.target.value)}
                  >
                    <option value="">All muscle groups</option>
                    {muscleGroups?.map((mg) => (
                      <option key={mg.id} value={mg.slug}>{mg.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Exercise</Label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                  >
                    <option value="">Select exercise...</option>
                    {availableExercises?.map((e) => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Target Reps (weekly total)</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="e.g. 100"
                    value={targetReps}
                    onChange={(e) => setTargetReps(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleAddGoal}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={!selectedExercise || !targetReps || setGoal.isPending}
                >
                  {setGoal.isPending ? 'Setting...' : 'Set Goal'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : !goals?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">No goals yet</h3>
            <p className="text-muted-foreground mb-4">Set weekly rep targets to stay on track</p>
            <Button onClick={() => setDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const exercise = (goal as unknown as { exercise: { name: string; muscle_group: { name: string } } }).exercise
            const logged = weeklyLogs
              ?.filter((l) => l.exercise_id === goal.exercise_id)
              .reduce((sum, l) => sum + l.reps * l.sets, 0) || 0
            const pct = Math.min(100, Math.round((logged / goal.target_reps) * 100))

            return (
              <Card key={goal.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{exercise?.name || 'Exercise'}</CardTitle>
                    <div className="flex items-center gap-2">
                      {pct >= 100 && <Badge className="bg-emerald-100 text-emerald-700">Complete!</Badge>}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-500"
                        onClick={() => handleDelete(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{exercise?.muscle_group?.name}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{logged} / {goal.target_reps} reps</span>
                    <span className="text-sm font-medium">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
