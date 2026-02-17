'use client'

import { useState } from 'react'
import { useLeaderboard } from '@/lib/hooks/use-social'
import { useExercises } from '@/lib/hooks/use-exercises'
import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trophy, ArrowLeft, Medal } from 'lucide-react'
import { formatShortDate, getWeekStart } from '@/lib/utils/date'
import Link from 'next/link'

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [exerciseId, setExerciseId] = useState<string | undefined>()
  const [friendsOnly, setFriendsOnly] = useState(false)
  const { data: leaderboard, isLoading } = useLeaderboard(exerciseId, friendsOnly)
  const { data: exercises } = useExercises()

  // Aggregate leaderboard: sum total_reps per user across all exercises
  const aggregated = !exerciseId && leaderboard
    ? Object.values(
        leaderboard.reduce((acc: Record<string, { user_id: string; username: string; display_name: string | null; avatar_url: string | null; total_reps: number }>, entry) => {
          if (!acc[entry.user_id]) {
            acc[entry.user_id] = { ...entry, total_reps: 0 }
          }
          acc[entry.user_id].total_reps += entry.total_reps
          return acc
        }, {})
      ).sort((a, b) => b.total_reps - a.total_reps)
    : leaderboard

  const getRankIcon = (index: number) => {
    if (index === 0) return <Medal className="h-5 w-5 text-yellow-500" />
    if (index === 1) return <Medal className="h-5 w-5 text-muted-foreground" />
    if (index === 2) return <Medal className="h-5 w-5 text-amber-700" />
    return <span className="text-sm text-muted-foreground w-5 text-center">{index + 1}</span>
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <Link href="/social">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground">Week of {formatShortDate(getWeekStart())}</p>
        </div>
      </div>

      <Tabs defaultValue="global" onValueChange={(v) => setFriendsOnly(v === 'friends')}>
        <TabsList>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
      </Tabs>

      <div>
        <Select value={exerciseId || '__all__'} onValueChange={(v) => setExerciseId(v === '__all__' ? undefined : v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Exercises (Aggregate)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Exercises (Aggregate)</SelectItem>
            {exercises?.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : !aggregated?.length ? (
            <p className="text-center py-8 text-muted-foreground">No entries this week</p>
          ) : (
            <div className="space-y-2">
              {(aggregated as { user_id: string; username: string; display_name: string; total_reps: number }[]).map((entry, i) => (
                <div
                  key={`${entry.user_id}-${i}`}
                  className={`flex items-center gap-3 py-2 px-2 rounded ${
                    entry.user_id === user?.id ? 'bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800' : 'border-b'
                  }`}
                >
                  {getRankIcon(i)}
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {(entry.display_name || entry.username)?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{entry.display_name || entry.username}</p>
                    <p className="text-xs text-muted-foreground">@{entry.username}</p>
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    {entry.total_reps.toLocaleString()} reps
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
