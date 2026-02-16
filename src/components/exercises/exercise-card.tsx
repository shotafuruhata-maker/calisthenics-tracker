'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDifficultyLabel, getDifficultyColor } from '@/lib/utils/formatting'

interface ExerciseCardProps {
  exercise: {
    id: string
    name: string
    slug: string
    description: string
    difficulty: number
    muscle_group?: { name: string; slug: string } | null
    secondary_muscles: string[]
  }
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <Link href={`/exercises/${exercise.slug}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base">{exercise.name}</CardTitle>
            <Badge className={getDifficultyColor(exercise.difficulty)} variant="secondary">
              {getDifficultyLabel(exercise.difficulty)}
            </Badge>
          </div>
          {exercise.muscle_group && (
            <Badge variant="outline" className="w-fit text-xs">
              {exercise.muscle_group.name}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 line-clamp-2">{exercise.description}</p>
          {exercise.secondary_muscles.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {exercise.secondary_muscles.map((m) => (
                <span key={m} className="text-xs text-gray-400">{m}</span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
