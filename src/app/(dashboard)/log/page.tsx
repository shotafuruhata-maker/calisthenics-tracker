'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDailyLogs, useLogReps, useDeleteLog } from '@/lib/hooks/use-daily-logs'
import { useExercises, useMuscleGroups } from '@/lib/hooks/use-exercises'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { getToday, formatShortDate } from '@/lib/utils/date'

function LogPageContent() {
  const searchParams = useSearchParams()
  const { data: todayLogs, isLoading } = useDailyLogs()
  const { data: exercises } = useExercises()
  const { data: muscleGroups } = useMuscleGroups()
  const logReps = useLogReps()
  const deleteLog = useDeleteLog()

  const [selectedExercise, setSelectedExercise] = useState(searchParams.get('exercise') || '')
  const [reps, setReps] = useState('')
  const [sets, setSets] = useState('1')
  const [notes, setNotes] = useState('')
  const [filterMuscle, setFilterMuscle] = useState('')

  const filteredExercises = exercises?.filter(
    (e) => !filterMuscle || (e as unknown as { muscle_group: { slug: string } }).muscle_group?.slug === filterMuscle
  )

  const selectedExerciseObj = exercises?.find(
    (e) => e.id === selectedExercise || e.slug === selectedExercise
  )

  const handleLog = async () => {
    const exerciseId = selectedExerciseObj?.id
    if (!exerciseId || !reps) return

    try {
      await logReps.mutateAsync({
        exerciseId,
        reps: parseInt(reps),
        sets: parseInt(sets) || 1,
        notes: notes || undefined,
      })
      toast.success(`Logged ${sets !== '1' ? `${sets}x` : ''}${reps} reps!`)
      setReps('')
      setSets('1')
      setNotes('')
    } catch {
      toast.error('Failed to log reps')
    }
  }

  const handleDelete = async (logId: string) => {
    try {
      await deleteLog.mutateAsync(logId)
      toast.success('Log entry removed')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const todayTotal = todayLogs?.reduce((sum, l) => sum + l.reps * l.sets, 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Log Reps</h1>
        <p className="text-muted-foreground">{formatShortDate(getToday())} — {todayTotal.toLocaleString()} total reps today</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">New Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Muscle Group</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                value={filterMuscle}
                onChange={(e) => { setFilterMuscle(e.target.value); setSelectedExercise('') }}
              >
                <option value="">All</option>
                {muscleGroups?.map((mg) => (
                  <option key={mg.id} value={mg.slug}>{mg.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Exercise</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                value={selectedExerciseObj?.id || ''}
                onChange={(e) => setSelectedExercise(e.target.value)}
              >
                <option value="">Select...</option>
                {filteredExercises?.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Reps</Label>
              <Input
                type="number"
                min="1"
                placeholder="10"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sets</Label>
              <Input
                type="number"
                min="1"
                placeholder="1"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input
                placeholder="Optional"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            {[5, 10, 15, 20, 25, 50].map((n) => (
              <Button
                key={n}
                variant="outline"
                size="sm"
                onClick={() => setReps(String(n))}
                className={reps === String(n) ? 'border-emerald-500 bg-emerald-50' : ''}
              >
                {n}
              </Button>
            ))}
          </div>

          <Button
            onClick={handleLog}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={!selectedExerciseObj || !reps || logReps.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            {logReps.isPending ? 'Logging...' : 'Log Reps'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today&apos;s Log</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : !todayLogs?.length ? (
            <p className="text-center py-8 text-muted-foreground">Nothing logged yet today</p>
          ) : (
            <div className="space-y-2">
              {todayLogs.map((log) => {
                const exercise = (log as unknown as { exercise: { name: string; muscle_group: { name: string } } }).exercise
                return (
                  <div key={log.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">{exercise?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {exercise?.muscle_group?.name}
                        {log.notes && ` — ${log.notes}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {log.sets > 1 ? `${log.sets}x${log.reps}` : `${log.reps}`} reps
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-red-500"
                        onClick={() => handleDelete(log.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function LogPage() {
  return (
    <Suspense>
      <LogPageContent />
    </Suspense>
  )
}
