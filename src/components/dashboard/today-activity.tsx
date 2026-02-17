'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Activity, Plus } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'

interface Log {
  id: string
  reps: number
  sets: number
  created_at: string
  exercise: {
    name: string
    slug: string
    muscle_group: { name: string }
  }
}

interface TodayActivityProps {
  logs: Log[]
  isLoading: boolean
  onQuickLog: () => void
}

export function TodayActivity({ logs, isLoading, onQuickLog }: TodayActivityProps) {
  const totalVolume = logs.reduce((sum, l) => sum + l.reps * l.sets, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Today&apos;s Activity</CardTitle>
          <Button size="sm" variant="outline" onClick={onQuickLog}>
            <Plus className="h-4 w-4" /> Quick Log
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !logs.length ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Activity className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">No reps logged today</p>
            <Button size="sm" onClick={onQuickLog}>Log your first set</Button>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              {logs.map((log) => (
                <Link
                  key={log.id}
                  href={`/exercises/${log.exercise?.slug}`}
                  className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-sm">{log.exercise?.name}</p>
                      <Badge variant="secondary" className="text-[10px] mt-0.5">
                        {log.exercise?.muscle_group?.name}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="tabular-nums">
                      {log.sets > 1 ? `${log.sets}x${log.reps}` : `${log.reps}`} reps
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(log.created_at), 'h:mm a')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {logs.length > 0 && (
              <div className="mt-4 pt-3 border-t flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total volume</span>
                <span className="font-semibold tabular-nums">{totalVolume.toLocaleString()} reps</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
