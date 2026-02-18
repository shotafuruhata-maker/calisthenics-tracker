'use client'

import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useExercises } from '@/lib/hooks/use-exercises'
import { useLogReps } from '@/lib/hooks/use-daily-logs'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

interface QuickLogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const QUICK_REPS = [5, 10, 15, 20, 25, 50]

export function QuickLogDialog({ open, onOpenChange }: QuickLogDialogProps) {
  const [exerciseId, setExerciseId] = useState('')
  const [reps, setReps] = useState(10)
  const [sets, setSets] = useState(1)
  const { data: exercises } = useExercises()
  const logReps = useLogReps()

  useEffect(() => {
    if (!open) { setExerciseId(''); setReps(10); setSets(1) }
  }, [open])

  const handleSubmit = async () => {
    if (!exerciseId) {
      toast.error('Please select an exercise')
      return
    }
    if (reps <= 0) {
      toast.error('Reps must be greater than 0')
      return
    }

    try {
      await logReps.mutateAsync({ exerciseId, reps, sets })
      toast.success('Reps logged!')
      onOpenChange(false)
      setExerciseId('')
      setReps(10)
      setSets(1)
    } catch {
      toast.error('Failed to log reps')
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Quick Log</SheetTitle>
          <SheetDescription>Log a set without leaving the dashboard</SheetDescription>
        </SheetHeader>
        <div className="space-y-6 p-4">
          <div className="space-y-2">
            <Label>Exercise</Label>
            <Select value={exerciseId} onValueChange={setExerciseId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select exercise" />
              </SelectTrigger>
              <SelectContent>
                {exercises?.map((ex) => (
                  <SelectItem key={ex.id} value={ex.id}>
                    {ex.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Reps</Label>
            <div className="flex flex-wrap gap-2">
              {QUICK_REPS.map((r) => (
                <Button
                  key={r}
                  size="sm"
                  variant={reps === r ? 'default' : 'outline'}
                  onClick={() => setReps(r)}
                  className="tabular-nums"
                >
                  {r}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              min={1}
              value={reps}
              onChange={(e) => setReps(Number(e.target.value))}
              className="tabular-nums"
            />
          </div>

          <div className="space-y-2">
            <Label>Sets</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={sets === s ? 'default' : 'outline'}
                  onClick={() => setSets(s)}
                  className="tabular-nums"
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={logReps.isPending}
          >
            {logReps.isPending ? 'Logging...' : 'Log Reps'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function QuickLogFAB({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-40 md:hidden h-14 w-14 rounded-full bg-emerald-600 text-white shadow-lg flex items-center justify-center hover:bg-emerald-700 transition-colors active:scale-95"
    >
      <Plus className="h-6 w-6" />
    </button>
  )
}
