'use client'

import { useCardioRuns } from '@/lib/hooks/use-cardio'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Plus, Clock, Route } from 'lucide-react'
import { formatDuration } from '@/lib/utils/date'
import { metersToKm } from '@/lib/utils/geo'
import Link from 'next/link'
import { format } from 'date-fns'

export default function CardioPage() {
  const { data: runs, isLoading } = useCardioRuns()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cardio</h1>
          <p className="text-muted-foreground">Track your runs with GPS</p>
        </div>
        <Link href="/cardio/track">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            New Run
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : !runs?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="rounded-full bg-muted p-4 mx-auto mb-4 w-fit">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No runs yet</h3>
            <p className="text-muted-foreground mb-4">Track your first run with live GPS</p>
            <Link href="/cardio/track">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Start Running</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {runs.map((run) => (
            <Link key={run.id} href={`/cardio/${run.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer mb-3">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-500" />
                        <span className="font-medium">
                          {format(new Date(run.started_at), 'MMM d, yyyy · h:mm a')}
                        </span>
                        <Badge variant={run.status === 'completed' ? 'secondary' : 'default'}>
                          {run.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Route className="h-3 w-3" />
                          {metersToKm(run.total_distance_m)} km
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(run.total_duration_s)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
