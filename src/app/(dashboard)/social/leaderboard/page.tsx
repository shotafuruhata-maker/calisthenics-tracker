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
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />
    if (index === 2) return <Medal className="h-5 w-5 text-amber-700" />
    return <span className="text-sm text-gray-500 w-5 text-center">{index + 1}</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/social">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-500">Week of {formatShortDate(getWeekStart())}</p>
        </div>
      </div>

      <Tabs defaultValue="global" onValueChange={(v) => setFriendsOnly(v === 'friends')}>
        <TabsList>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
      </Tabs>

      <div>
        <select
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={exerciseId || ''}
          onChange={(e) => setExerciseId(e.target.value || undefined)}
        >
          <option value="">All Exercises (Aggregate)</option>
          {exercises?.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
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
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : !aggregated?.length ? (
            <p className="text-center py-8 text-gray-500">No entries this week</p>
          ) : (
            <div className="space-y-2">
              {(aggregated as { user_id: string; username: string; display_name: string; total_reps: number }[]).map((entry, i) => (
                <div
                  key={`${entry.user_id}-${i}`}
                  className={`flex items-center gap-3 py-2 px-2 rounded ${
                    entry.user_id === user?.id ? 'bg-emerald-50 border border-emerald-200' : 'border-b'
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
                    <p className="text-xs text-gray-500">@{entry.username}</p>
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
