'use client'

import { useState } from 'react'
import { useExercises, useMuscleGroups } from '@/lib/hooks/use-exercises'
import { ExerciseCard } from '@/components/exercises/exercise-card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ExercisesPage() {
  const [selectedMuscle, setSelectedMuscle] = useState<string | undefined>()
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | undefined>()
  const [search, setSearch] = useState('')
  const { data: exercises, isLoading } = useExercises(selectedMuscle, selectedDifficulty)
  const { data: muscleGroups } = useMuscleGroups()

  const filtered = exercises?.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Exercise Library</h1>
        <p className="text-muted-foreground">Browse {exercises?.length || 0} calisthenics exercises</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant={!selectedMuscle ? 'default' : 'outline'}
          className={cn('cursor-pointer', !selectedMuscle && 'bg-emerald-600')}
          onClick={() => setSelectedMuscle(undefined)}
        >
          All
        </Badge>
        {muscleGroups?.map((mg) => (
          <Badge
            key={mg.id}
            variant={selectedMuscle === mg.slug ? 'default' : 'outline'}
            className={cn('cursor-pointer', selectedMuscle === mg.slug && 'bg-emerald-600')}
            onClick={() => setSelectedMuscle(selectedMuscle === mg.slug ? undefined : mg.slug)}
          >
            {mg.name}
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        {[
          { value: undefined, label: 'All Levels' },
          { value: 1, label: 'Beginner' },
          { value: 2, label: 'Intermediate' },
          { value: 3, label: 'Advanced' },
        ].map((d) => (
          <Badge
            key={d.label}
            variant={selectedDifficulty === d.value ? 'default' : 'outline'}
            className={cn('cursor-pointer', selectedDifficulty === d.value && 'bg-emerald-600')}
            onClick={() => setSelectedDifficulty(d.value)}
          >
            {d.label}
          </Badge>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise as never} />
          ))}
          {filtered?.length === 0 && (
            <p className="col-span-full text-center py-12 text-muted-foreground">No exercises found</p>
          )}
        </div>
      )}
    </div>
  )
}
