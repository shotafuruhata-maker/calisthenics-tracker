'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useExercises(muscleGroupSlug?: string, difficulty?: number) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['exercises', muscleGroupSlug, difficulty],
    queryFn: async () => {
      let query = supabase
        .from('exercises')
        .select('*, muscle_group:muscle_groups(*)')
        .order('name')

      if (muscleGroupSlug) {
        const { data: mg } = await supabase
          .from('muscle_groups')
          .select('id')
          .eq('slug', muscleGroupSlug)
          .single()
        if (mg) query = query.eq('muscle_group_id', mg.id)
      }

      if (difficulty) {
        query = query.eq('difficulty', difficulty)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

export function useExercise(slug: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['exercise', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercises')
        .select('*, muscle_group:muscle_groups(*)')
        .eq('slug', slug)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!slug,
  })
}

export function useMuscleGroups() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['muscle-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('muscle_groups')
        .select('*')
        .order('name')
      if (error) throw error
      return data
    },
  })
}
