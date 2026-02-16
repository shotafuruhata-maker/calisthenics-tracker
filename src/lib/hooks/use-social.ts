'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { getWeekStart } from '@/lib/utils/date'

export function useFriends() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          requester:profiles!requester_id(*),
          addressee:profiles!addressee_id(*)
        `)
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .eq('status', 'accepted')
      if (error) throw error
      return data
    },
  })
}

export function useFriendRequests() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['friend-requests'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('friendships')
        .select('*, requester:profiles!requester_id(*)')
        .eq('addressee_id', user.id)
        .eq('status', 'pending')
      if (error) throw error
      return data
    },
  })
}

export function useSendFriendRequest() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (addresseeId: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('friendships')
        .insert({ requester_id: user.id, addressee_id: addresseeId })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] })
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] })
    },
  })
}

export function useRespondToRequest() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ friendshipId, status }: { friendshipId: string; status: 'accepted' | 'rejected' }) => {
      const { data, error } = await supabase
        .from('friendships')
        .update({ status })
        .eq('id', friendshipId)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] })
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] })
    },
  })
}

export function useSearchUsers(query: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['search-users', query],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', `%${query}%`)
        .limit(10)
      if (error) throw error
      return data
    },
    enabled: query.length >= 2,
  })
}

export function useLeaderboard(exerciseId?: string, friendsOnly?: boolean) {
  const supabase = createClient()
  const weekStart = getWeekStart()

  return useQuery({
    queryKey: ['leaderboard', weekStart, exerciseId, friendsOnly],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let query = supabase
        .from('weekly_leaderboard')
        .select('*')
        .eq('week_start', weekStart)

      if (exerciseId) {
        query = query.eq('exercise_id', exerciseId)
      }

      const { data, error } = await query.order('total_reps', { ascending: false }).limit(50)
      if (error) throw error

      if (friendsOnly) {
        const { data: friends } = await supabase
          .from('friendships')
          .select('requester_id, addressee_id')
          .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
          .eq('status', 'accepted')

        const friendIds = new Set<string>([user.id])
        friends?.forEach((f) => {
          friendIds.add(f.requester_id)
          friendIds.add(f.addressee_id)
        })

        return data?.filter((entry) => friendIds.has(entry.user_id)) || []
      }

      return data
    },
  })
}

export function useActivityFeed() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['activity-feed'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get friend IDs
      const { data: friends } = await supabase
        .from('friendships')
        .select('requester_id, addressee_id')
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .eq('status', 'accepted')

      const friendIds = [user.id]
      friends?.forEach((f) => {
        if (f.requester_id !== user.id) friendIds.push(f.requester_id)
        if (f.addressee_id !== user.id) friendIds.push(f.addressee_id)
      })

      const { data, error } = await supabase
        .from('activity_feed')
        .select('*, profile:profiles!user_id(*)')
        .in('user_id', friendIds)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data
    },
  })
}
