'use client'

import { use, useState, useEffect, useRef, useCallback } from 'react'
import { useCardioRun, useRunWaypoints } from '@/lib/hooks/use-cardio'
import type { Database } from '@/lib/supabase/types'

type Waypoint = Database['public']['Tables']['run_waypoints']['Row']
type CardioRun = Database['public']['Tables']['cardio_runs']['Row']
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play, Pause, SkipForward } from 'lucide-react'
import { formatDuration, formatPace } from '@/lib/utils/date'
import { metersToKm, MILE_IN_METERS } from '@/lib/utils/geo'
import { format } from 'date-fns'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const ReplayMap = dynamic(() => import('@/components/cardio/replay-map'), { ssr: false })

export default function RunDetailPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = use(params)
  const { data: rawRun, isLoading: runLoading } = useCardioRun(runId)
  const run = rawRun as CardioRun | undefined
  const { data: rawWaypoints, isLoading: wpLoading } = useRunWaypoints(runId)
  const waypoints = rawWaypoints as Waypoint[] | undefined

  const [replayIndex, setReplayIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopReplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsPlaying(false)
  }, [])

  useEffect(() => {
    if (!isPlaying || !waypoints?.length) return

    intervalRef.current = setInterval(() => {
      setReplayIndex((prev) => {
        if (prev >= (waypoints?.length || 0) - 1) {
          stopReplay()
          return prev
        }
        return prev + 1
      })
    }, 100 / speed)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, speed, waypoints?.length, stopReplay])

  const startReplay = () => {
    if (replayIndex >= (waypoints?.length || 0) - 1) setReplayIndex(0)
    setIsPlaying(true)
  }

  // Calculate mile splits from waypoints
  const mileSplits: { mile: number; time_s: number }[] = []
  if (waypoints?.length) {
    let dist = 0
    let lastSplitTime = 0
    for (let i = 1; i < waypoints.length; i++) {
      dist += waypoints[i].segment_distance_m
      const prevMiles = Math.floor((dist - waypoints[i].segment_distance_m) / MILE_IN_METERS)
      const curMiles = Math.floor(dist / MILE_IN_METERS)
      if (curMiles > prevMiles) {
        mileSplits.push({
          mile: curMiles,
          time_s: waypoints[i].elapsed_s - lastSplitTime,
        })
        lastSplitTime = waypoints[i].elapsed_s
      }
    }
  }

  if (runLoading || wpLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-[400px] bg-muted rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!run) {
    return <p className="text-center py-12 text-muted-foreground">Run not found</p>
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <Link href="/cardio">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Run Detail</h1>
          <p className="text-muted-foreground">{format(new Date(run.started_at), 'MMMM d, yyyy · h:mm a')}</p>
        </div>
        <Badge>{run.status}</Badge>
      </div>

      {/* Map with replay */}
      <div className="h-[350px] rounded-lg overflow-hidden border">
        <ReplayMap
          waypoints={waypoints || []}
          replayIndex={replayIndex}
        />
      </div>

      {/* Replay controls */}
      {waypoints && waypoints.length > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={isPlaying ? stopReplay : startReplay}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <input
            type="range"
            min={0}
            max={(waypoints?.length || 1) - 1}
            value={replayIndex}
            onChange={(e) => { stopReplay(); setReplayIndex(Number(e.target.value)) }}
            className="flex-1"
          />
          <div className="flex gap-1">
            {[1, 2, 5, 10].map((s) => (
              <Button
                key={s}
                variant={speed === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSpeed(s)}
                className={speed === s ? 'bg-emerald-600' : ''}
              >
                {s}x
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Distance</p>
            <p className="text-2xl font-bold">{metersToKm(run.total_distance_m)}</p>
            <p className="text-xs text-muted-foreground">km</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Duration</p>
            <p className="text-2xl font-bold font-mono">{formatDuration(run.total_duration_s)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Avg Pace</p>
            <p className="text-2xl font-bold">
              {run.avg_pace ? formatPace(run.avg_pace) : '--'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mile splits */}
      {mileSplits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mile Splits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mileSplits.map((split) => (
                <div key={split.mile} className="flex justify-between text-sm border-b last:border-0 pb-2">
                  <span>Mile {split.mile}</span>
                  <span className="font-mono">{formatDuration(split.time_s)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
