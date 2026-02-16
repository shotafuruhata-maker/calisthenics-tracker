'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface Waypoint {
  lat: number
  lng: number
  elapsed_s: number
  segment_distance_m: number
}

function ReplayUpdater({ waypoints, replayIndex }: { waypoints: Waypoint[]; replayIndex: number }) {
  const map = useMap()
  const initialized = useRef(false)

  useEffect(() => {
    if (waypoints.length === 0) return

    if (!initialized.current && waypoints.length > 1) {
      const bounds = waypoints.map((wp): [number, number] => [wp.lat, wp.lng])
      map.fitBounds(bounds, { padding: [30, 30] })
      initialized.current = true
    }

    const wp = waypoints[replayIndex]
    if (wp) {
      map.panTo([wp.lat, wp.lng])
    }
  }, [map, waypoints, replayIndex])

  return null
}

function getPaceColor(pace: number): string {
  if (pace < 300) return '#10b981' // fast - green
  if (pace < 360) return '#f59e0b' // moderate - amber
  return '#ef4444' // slow - red
}

export default function ReplayMap({
  waypoints,
  replayIndex,
}: {
  waypoints: Waypoint[]
  replayIndex: number
}) {
  const positions = waypoints.map((wp): [number, number] => [wp.lat, wp.lng])
  const center = positions.length > 0 ? positions[0] : [40.7128, -74.006] as [number, number]

  // Create colored segments based on pace
  const segments: { positions: [number, number][]; color: string }[] = []
  for (let i = 1; i < waypoints.length; i++) {
    const timeDiff = waypoints[i].elapsed_s - waypoints[i - 1].elapsed_s
    const dist = waypoints[i].segment_distance_m
    const pace = dist > 0 ? (timeDiff / dist) * 1000 : 999
    const color = getPaceColor(pace)

    segments.push({
      positions: [
        [waypoints[i - 1].lat, waypoints[i - 1].lng],
        [waypoints[i].lat, waypoints[i].lng],
      ],
      color,
    })
  }

  const replayPos = waypoints[replayIndex]

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Pace-colored segments */}
      {segments.map((seg, i) => (
        <Polyline key={i} positions={seg.positions} color={seg.color} weight={4} opacity={i <= replayIndex ? 1 : 0.3} />
      ))}
      {/* Current replay position */}
      {replayPos && (
        <CircleMarker
          center={[replayPos.lat, replayPos.lng]}
          radius={8}
          fillColor="#10b981"
          fillOpacity={1}
          color="white"
          weight={3}
        />
      )}
      <ReplayUpdater waypoints={waypoints} replayIndex={replayIndex} />
    </MapContainer>
  )
}
