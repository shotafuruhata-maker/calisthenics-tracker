'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { getToday, getWeekStart, getWeekEnd } from '@/lib/utils/date'
import { format, subDays, parseISO } from 'date-fns'

export function useDailyLogs(date?: string) {
  const supabase = createClient()
  const logDate = date || getToday()

  return useQuery({
    queryKey: ['daily-logs', logDate],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('daily_logs')
        .select('*, exercise:exercises(*, muscle_group:muscle_groups(*))')
        .eq('user_id', user.id)
        .eq('log_date', logDate)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useWeeklyLogs(weekStart?: string) {
  const supabase = createClient()
  const week = weekStart || getWeekStart()
  const weekEnd = getWeekEnd(new Date(week))

  return useQuery({
    queryKey: ['weekly-logs', week],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('daily_logs')
        .select('*, exercise:exercises(*, muscle_group:muscle_groups(*))')
        .eq('user_id', user.id)
        .gte('log_date', week)
        .lte('log_date', weekEnd)
        .order('log_date', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useLogReps() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      exerciseId,
      reps,
      sets = 1,
      notes,
      logDate,
    }: {
      exerciseId: string
      reps: number
      sets?: number
      notes?: string
      logDate?: string
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('daily_logs')
        .insert({
          user_id: user.id,
          exercise_id: exerciseId,
          reps,
          sets,
          notes: notes || null,
          log_date: logDate || getToday(),
        })
        .select('*, exercise:exercises(*, muscle_group:muscle_groups(*))')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-logs'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-logs'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-goals'] })
      queryClient.invalidateQueries({ queryKey: ['streak'] })
    },
  })
}

export function useDeleteLog() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (logId: string) => {
      const { error } = await supabase
        .from('daily_logs')
        .delete()
        .eq('id', logId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-logs'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-logs'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-goals'] })
      queryClient.invalidateQueries({ queryKey: ['streak'] })
    },
  })
}

export function useStreak() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['streak'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const today = new Date()
      const thirtyDaysAgo = format(subDays(today, 30), 'yyyy-MM-dd')

      const { data, error } = await supabase
        .from('daily_logs')
        .select('log_date')
        .eq('user_id', user.id)
        .gte('log_date', thirtyDaysAgo)
        .order('log_date', { ascending: false })
      if (error) throw error

      const uniqueDays = new Set(data.map((d) => d.log_date))
      let streak = 0
      let checkDate = today

      for (let i = 0; i < 31; i++) {
        const dateStr = format(checkDate, 'yyyy-MM-dd')
        if (uniqueDays.has(dateStr)) {
          streak++
        } else if (i > 0) {
          break
        }
        checkDate = subDays(checkDate, 1)
      }

      return streak
    },
  })
}
