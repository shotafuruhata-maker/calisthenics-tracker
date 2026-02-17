'use client'

import { useEffect } from 'react'
import { useActivityFeed } from '@/lib/hooks/use-social'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Dumbbell, Target, MapPin, UserPlus, Rss } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

const activityIcons: Record<string, typeof Dumbbell> = {
  workout_log: Dumbbell,
  goal_set: Target,
  run_complete: MapPin,
  friend_added: UserPlus,
}

const activityLabels: Record<string, string> = {
  workout_log: 'logged a workout',
  goal_set: 'set a new goal',
  run_complete: 'completed a run',
  friend_added: 'added a friend',
}

export default function FeedPage() {
  const { data: feed, isLoading } = useActivityFeed()
  const queryClient = useQueryClient()
  const supabase = createClient()

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('activity-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_feed' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['activity-feed'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, queryClient])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <Link href="/social">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Activity Feed</h1>
          <p className="text-muted-foreground">Recent activity from you and your friends</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : !feed?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="rounded-full bg-muted p-4 mx-auto mb-4 w-fit">
              <Rss className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No activity yet. Start logging workouts and adding friends!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {feed.map((item) => {
            const profile = item.profile as unknown as { username: string; display_name: string | null } | null
            const Icon = activityIcons[item.activity_type] || Dumbbell
            const label = activityLabels[item.activity_type] || 'did something'
            const payload = item.payload as Record<string, unknown>

            return (
              <Card key={item.id}>
                <CardContent className="py-3 flex items-start gap-3">
                  <Avatar className="h-9 w-9 mt-0.5">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                      {(profile?.display_name || profile?.username || '?')[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{profile?.display_name || profile?.username}</span>
                      {' '}{label}
                    </p>
                    {item.activity_type === 'workout_log' && !!payload.reps && (
                      <p className="text-xs text-muted-foreground">
                        {payload.sets && Number(payload.sets) > 1 ? `${payload.sets}x` : ''}{String(payload.reps)} reps
                      </p>
                    )}
                    {item.activity_type === 'run_complete' && !!payload.distance_m && (
                      <p className="text-xs text-muted-foreground">
                        {(Number(payload.distance_m) / 1000).toFixed(2)} km
                      </p>
                    )}
                    {item.activity_type === 'goal_set' && !!payload.target_reps && (
                      <p className="text-xs text-muted-foreground">
                        Target: {String(payload.target_reps)} reps/week
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Icon className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
