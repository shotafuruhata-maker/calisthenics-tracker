'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useGpsStore } from '@/lib/stores/gps-store'
import { useCreateRun, useUpdateRun, useBatchWaypoints } from '@/lib/hooks/use-cardio'
import { haversineDistance, metersToKm } from '@/lib/utils/geo'
import { formatDuration, formatPace } from '@/lib/utils/date'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, Square, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

const LiveMap = dynamic(() => import('@/components/cardio/live-map'), { ssr: false })

export default function TrackPage() {
  const router = useRouter()
  const store = useGpsStore()
  const createRun = useCreateRun()
  const updateRun = useUpdateRun()
  const batchWaypoints = useBatchWaypoints()
  const pendingWaypoints = useRef<Parameters<typeof batchWaypoints.mutateAsync>[0]>([])
  const batchTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const flushWaypoints = useCallback(async () => {
    if (pendingWaypoints.current.length === 0) return
    const batch = [...pendingWaypoints.current]
    pendingWaypoints.current = []
    try {
      await batchWaypoints.mutateAsync(batch)
    } catch {
      pendingWaypoints.current = [...batch, ...pendingWaypoints.current]
    }
  }, [batchWaypoints])

  const handleStart = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported')
      return
    }

    try {
      const run = await createRun.mutateAsync()
      store.startTracking(run.id)

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const state = useGpsStore.getState()
          if (state.isPaused) return

          const { latitude: lat, longitude: lng, altitude, accuracy } = position.coords
          const now = Date.now()
          const elapsed = state.startTime ? Math.floor((now - state.startTime - state.pausedTime) / 1000) : 0

          let segDist = 0
          if (state.waypoints.length > 0) {
            const prev = state.waypoints[state.waypoints.length - 1]
            segDist = haversineDistance(prev.lat, prev.lng, lat, lng)
            if (segDist < 2) return // Skip tiny movements
          }

          const wp = { lat, lng, altitude, accuracy, timestamp: now, elapsed_s: elapsed, segment_distance_m: segDist }
          store.addWaypoint(wp)

          pendingWaypoints.current.push({
            run_id: run.id,
            lat, lng, altitude, accuracy,
            timestamp: new Date(now).toISOString(),
            elapsed_s: elapsed,
            segment_distance_m: segDist,
          })
        },
        (error) => {
          toast.error(`GPS error: ${error.message}`)
        },
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
      )

      store.setWatchId(watchId)

      const timer = setInterval(() => store.tick(), 1000)
      store.setTimerInterval(timer)

      batchTimer.current = setInterval(flushWaypoints, 30000)

      toast.success('Run started! GPS tracking active.')
    } catch {
      toast.error('Failed to start run')
    }
  }

  const handlePause = () => {
    store.pauseTracking()
    toast('Run paused')
  }

  const handleResume = () => {
    store.resumeTracking()
    const timer = setInterval(() => store.tick(), 1000)
    store.setTimerInterval(timer)
    toast('Run resumed')
  }

  const handleStop = async () => {
    const state = useGpsStore.getState()
    if (!state.runId) return

    await flushWaypoints()

    const routeGeoJson = {
      type: 'LineString',
      coordinates: state.waypoints.map((wp) => [wp.lng, wp.lat]),
    }

    try {
      await updateRun.mutateAsync({
        runId: state.runId,
        status: 'completed',
        finished_at: new Date().toISOString(),
        total_distance_m: state.totalDistance,
        total_duration_s: state.elapsedTime,
        avg_pace: state.totalDistance > 0 ? (state.elapsedTime / state.totalDistance) * 1000 : undefined,
        route_geojson: routeGeoJson,
      })
      toast.success('Run saved!')
      const runId = state.runId
      store.stopTracking()
      store.reset()
      if (batchTimer.current) clearInterval(batchTimer.current)
      router.push(`/cardio/${runId}`)
    } catch {
      toast.error('Failed to save run')
    }
  }

  useEffect(() => {
    return () => {
      if (batchTimer.current) clearInterval(batchTimer.current)
    }
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {store.isTracking ? 'Running...' : 'Start a Run'}
      </h1>

      {/* Map */}
      <div className="h-[300px] md:h-[400px] rounded-lg overflow-hidden border">
        <LiveMap waypoints={store.waypoints} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Distance</p>
            <p className="text-2xl font-bold">{metersToKm(store.totalDistance)}</p>
            <p className="text-xs text-gray-400">km</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Time</p>
            <p className="text-2xl font-bold font-mono">{formatDuration(store.elapsedTime)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Pace</p>
            <p className="text-2xl font-bold">{store.currentPace > 0 ? formatPace(store.currentPace) : '--'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Mile splits */}
      {store.mileSplits.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-sm font-medium mb-2">Mile Splits</h3>
            <div className="space-y-1">
              {store.mileSplits.map((split) => (
                <div key={split.mile} className="flex justify-between text-sm">
                  <span>Mile {split.mile}</span>
                  <span className="font-mono">{formatDuration(split.time_s)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {!store.isTracking ? (
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 h-16 w-16 rounded-full"
            onClick={handleStart}
            disabled={createRun.isPending}
          >
            <Play className="h-6 w-6" />
          </Button>
        ) : (
          <>
            {store.isPaused ? (
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 h-16 w-16 rounded-full"
                onClick={handleResume}
              >
                <Play className="h-6 w-6" />
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                className="h-16 w-16 rounded-full"
                onClick={handlePause}
              >
                <Pause className="h-6 w-6" />
              </Button>
            )}
            <Button
              size="lg"
              variant="destructive"
              className="h-16 w-16 rounded-full"
              onClick={handleStop}
            >
              <Square className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {!store.isTracking && (
        <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-1">
          <MapPin className="h-3 w-3" />
          GPS will activate when you start
        </p>
      )}
    </div>
  )
}
