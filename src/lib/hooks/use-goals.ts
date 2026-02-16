'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { getWeekStart } from '@/lib/utils/date'

export function useWeeklyGoals(weekStart?: string) {
  const supabase = createClient()
  const week = weekStart || getWeekStart()

  return useQuery({
    queryKey: ['weekly-goals', week],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('weekly_goals')
        .select('*, exercise:exercises(*, muscle_group:muscle_groups(*))')
        .eq('user_id', user.id)
        .eq('week_start', week)
      if (error) throw error
      return data
    },
  })
}

export function useSetGoal() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      exerciseId,
      targetReps,
      weekStart,
    }: {
      exerciseId: string
      targetReps: number
      weekStart?: string
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const week = weekStart || getWeekStart()

      const { data, error } = await supabase
        .from('weekly_goals')
        .upsert(
          {
            user_id: user.id,
            exercise_id: exerciseId,
            week_start: week,
            target_reps: targetReps,
          },
          { onConflict: 'user_id,exercise_id,week_start' }
        )
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-goals'] })
    },
  })
}

export function useDeleteGoal() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase
        .from('weekly_goals')
        .delete()
        .eq('id', goalId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-goals'] })
    },
  })
}
