'use client'

import { use } from 'react'
import { useExercise } from '@/lib/hooks/use-exercises'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getDifficultyLabel, getDifficultyColor } from '@/lib/utils/formatting'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ExerciseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { data: exercise, isLoading } = useExercise(slug)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-muted rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!exercise) {
    return <p className="text-center py-12 text-muted-foreground">Exercise not found</p>
  }

  const muscleGroup = exercise.muscle_group as { name: string; slug: string } | null

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <Link href="/exercises">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{exercise.name}</h1>
          {muscleGroup && <p className="text-muted-foreground">{muscleGroup.name}</p>}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(exercise.difficulty)}>
              {getDifficultyLabel(exercise.difficulty)}
            </Badge>
            {muscleGroup && <Badge variant="outline">{muscleGroup.name}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Description</h3>
            <p className="text-muted-foreground">{exercise.description}</p>
          </div>

          {exercise.instructions && (
            <div>
              <h3 className="font-semibold mb-1">Instructions</h3>
              <p className="text-muted-foreground whitespace-pre-line">{exercise.instructions}</p>
            </div>
          )}

          {exercise.secondary_muscles.length > 0 && (
            <div>
              <h3 className="font-semibold mb-1">Secondary Muscles</h3>
              <div className="flex flex-wrap gap-2">
                {exercise.secondary_muscles.map((m) => (
                  <Badge key={m} variant="secondary">{m}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Link href={`/log?exercise=${exercise.slug}`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">Log Reps</Button>
            </Link>
            <Link href={`/goals?exercise=${exercise.slug}`}>
              <Button variant="outline">Set Goal</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
