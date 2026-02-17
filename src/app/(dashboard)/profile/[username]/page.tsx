'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/use-auth'
import { useSendFriendRequest, useFriends } from '@/lib/hooks/use-social'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, UserPlus, Dumbbell } from 'lucide-react'
import { getWeekStart, getWeekEnd, formatShortDate } from '@/lib/utils/date'
import Link from 'next/link'
import { toast } from 'sonner'

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const { user } = useAuth()
  const supabase = createClient()
  const { data: friends } = useFriends()
  const sendRequest = useSendFriendRequest()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['public-profile', username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()
      if (error) throw error
      return data
    },
  })

  const { data: weeklyStats } = useQuery({
    queryKey: ['user-weekly-stats', profile?.id],
    queryFn: async () => {
      if (!profile) return null
      const { data } = await supabase
        .from('daily_logs')
        .select('reps, sets')
        .eq('user_id', profile.id)
        .gte('log_date', getWeekStart())
        .lte('log_date', getWeekEnd())
      const totalReps = data?.reduce((sum, l) => sum + l.reps * l.sets, 0) || 0
      return { totalReps, workouts: data?.length || 0 }
    },
    enabled: !!profile,
  })

  const isFriend = friends?.some((f) => {
    const req = f.requester as unknown as { id: string }
    const addr = f.addressee as unknown as { id: string }
    return req.id === profile?.id || addr.id === profile?.id
  })

  const isOwnProfile = user?.id === profile?.id

  const handleAddFriend = async () => {
    if (!profile) return
    try {
      await sendRequest.mutateAsync(profile.id)
      toast.success('Friend request sent!')
    } catch {
      toast.error('Failed to send request')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-xl mx-auto">
        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        <div className="h-48 bg-muted rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!profile) {
    return <p className="text-center py-12 text-muted-foreground">User not found</p>
  }

  const initials = (profile.display_name || profile.username)[0].toUpperCase()

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <Link href="/social">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">@{profile.username}</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{profile.display_name || profile.username}</CardTitle>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              </div>
            </div>
            {!isOwnProfile && (
              isFriend ? (
                <Badge variant="secondary">Friends</Badge>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleAddFriend}
                  disabled={sendRequest.isPending}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Friend
                </Button>
              )
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Dumbbell className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-2xl font-bold">{weeklyStats?.totalReps?.toLocaleString() || 0}</p>
              <p className="text-xs text-muted-foreground">Reps this week</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{weeklyStats?.workouts || 0}</p>
              <p className="text-xs text-muted-foreground">Log entries this week</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Week of {formatShortDate(getWeekStart())}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
