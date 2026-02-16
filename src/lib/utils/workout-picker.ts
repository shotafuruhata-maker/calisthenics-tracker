import type { Database } from '@/lib/supabase/types'

type Exercise = Database['public']['Tables']['exercises']['Row']
type WeeklyGoal = Database['public']['Tables']['weekly_goals']['Row']
type DailyLog = Database['public']['Tables']['daily_logs']['Row']

interface ExerciseWithDeficit {
  exercise: Exercise & { muscle_group?: { name: string; slug: string } }
  goal: WeeklyGoal
  totalLogged: number
  remaining: number
  deficitRatio: number
}

interface SuggestedExercise extends ExerciseWithDeficit {
  suggestedReps: number
}

export function calculateDeficits(
  goals: (WeeklyGoal & { exercise: Exercise & { muscle_group?: { name: string; slug: string } } })[],
  logs: DailyLog[]
): ExerciseWithDeficit[] {
  return goals.map((goal) => {
    const totalLogged = logs
      .filter((l) => l.exercise_id === goal.exercise_id)
      .reduce((sum, l) => sum + l.reps * l.sets, 0)
    const remaining = Math.max(0, goal.target_reps - totalLogged)
    const deficitRatio = goal.target_reps > 0 ? remaining / goal.target_reps : 0
    return {
      exercise: goal.exercise,
      goal,
      totalLogged,
      remaining,
      deficitRatio,
    }
  })
}

export function generateSuggestions(
  deficits: ExerciseWithDeficit[],
  yesterdayMuscleGroups: string[] = [],
  daysLeftInWeek: number = 3
): SuggestedExercise[] {
  const active = deficits.filter((d) => d.remaining > 0)

  const scored = active.map((d) => {
    let score = d.deficitRatio
    // De-prioritize muscle groups worked yesterday
    if (d.exercise.muscle_group && yesterdayMuscleGroups.includes(d.exercise.muscle_group.slug)) {
      score *= 0.5
    }
    return { ...d, score }
  })

  scored.sort((a, b) => b.score - a.score)

  const top = scored.slice(0, 8)

  return top.map((item) => ({
    ...item,
    suggestedReps: Math.ceil(item.remaining / Math.max(daysLeftInWeek, 1)),
  }))
}

export function getBonusRound(deficits: ExerciseWithDeficit[]): ExerciseWithDeficit[] {
  return deficits
    .filter((d) => d.deficitRatio > 0 && d.deficitRatio <= 0.15)
    .sort((a, b) => a.remaining - b.remaining)
    .slice(0, 3)
}
