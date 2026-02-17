'use client'

import { useQuery } from '@tanstack/react-query'
import { useLogReps } from '@/lib/hooks/use-daily-logs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Zap, Check, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function WorkoutPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['workout-suggestions'],
    queryFn: async () => {
      const res = await fetch('/api/workout-suggestion')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  const logReps = useLogReps()

  const handleQuickLog = async (exerciseId: string, reps: number, exerciseName: string) => {
    try {
      await logReps.mutateAsync({ exerciseId, reps })
      toast.success(`Logged ${reps} ${exerciseName} reps!`)
    } catch {
      toast.error('Failed to log')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Today&apos;s Workout</h1>
        <p className="text-muted-foreground">
          {data?.daysLeft ? `${data.daysLeft} days left this week` : 'Smart suggestions based on your goals'}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : !data?.suggestions?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="rounded-full bg-muted p-4 mx-auto mb-4 w-fit">
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No suggestions yet</h3>
            <p className="text-muted-foreground mb-4">Set weekly goals first to get personalized workout suggestions</p>
            <Link href="/goals">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Set Goals</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.suggestions.map((item: {
              exercise: { id: string; name: string; muscle_group: { name: string } }
              goal: { target_reps: number }
              totalLogged: number
              remaining: number
              deficitRatio: number
              suggestedReps: number
            }) => {
              const pct = Math.round(((item.goal.target_reps - item.remaining) / item.goal.target_reps) * 100)
              return (
                <Card key={item.exercise.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{item.exercise.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{item.exercise.muscle_group?.name}</p>
                      </div>
                      <Badge variant="outline">{item.remaining} left</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{item.totalLogged} / {item.goal.target_reps} reps</span>
                        <span>{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-emerald-600">
                        Do {item.suggestedReps} reps today
                      </span>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleQuickLog(item.exercise.id, item.suggestedReps, item.exercise.name)}
                        disabled={logReps.isPending}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Log {item.suggestedReps}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {data.bonusRound?.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-semibold">Bonus Round</h2>
                <p className="text-sm text-muted-foreground">Almost there! Finish these off</p>
              </div>
              {data.bonusRound.map((item: {
                exercise: { id: string; name: string }
                remaining: number
              }) => (
                <Card key={item.exercise.id} className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950">
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-sm">{item.exercise.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">— just {item.remaining} reps to go!</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-amber-300"
                      onClick={() => handleQuickLog(item.exercise.id, item.remaining, item.exercise.name)}
                      disabled={logReps.isPending}
                    >
                      Finish it!
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
