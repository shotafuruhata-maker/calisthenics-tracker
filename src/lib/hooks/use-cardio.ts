'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Json } from '@/lib/supabase/types'

export function useCardioRuns() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['cardio-runs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('cardio_runs')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useCardioRun(runId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['cardio-run', runId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cardio_runs')
        .select('*')
        .eq('id', runId)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!runId,
  })
}

export function useRunWaypoints(runId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['run-waypoints', runId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('run_waypoints')
        .select('*')
        .eq('run_id', runId)
        .order('timestamp')
      if (error) throw error
      return data
    },
    enabled: !!runId,
  })
}

export function useCreateRun() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('cardio_runs')
        .insert({ user_id: user.id, status: 'active' as const })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cardio-runs'] })
    },
  })
}

export function useUpdateRun() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      runId,
      ...updates
    }: {
      runId: string
      status?: 'active' | 'paused' | 'completed'
      finished_at?: string
      total_distance_m?: number
      total_duration_s?: number
      avg_pace?: number
      route_geojson?: Json
    }) => {
      const { data, error } = await supabase
        .from('cardio_runs')
        .update(updates)
        .eq('id', runId)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cardio-runs'] })
      queryClient.invalidateQueries({ queryKey: ['cardio-run', data.id] })
    },
  })
}

export function useBatchWaypoints() {
  const supabase = createClient()

  return useMutation({
    mutationFn: async (waypoints: {
      run_id: string
      lat: number
      lng: number
      altitude: number | null
      accuracy: number | null
      timestamp: string
      elapsed_s: number
      segment_distance_m: number
    }[]) => {
      const { error } = await supabase
        .from('run_waypoints')
        .insert(waypoints)
      if (error) throw error
    },
  })
}
