'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface Waypoint {
  lat: number
  lng: number
}

function MapUpdater({ waypoints }: { waypoints: Waypoint[] }) {
  const map = useMap()
  const initialized = useRef(false)

  useEffect(() => {
    if (waypoints.length === 0) return
    const last = waypoints[waypoints.length - 1]

    if (!initialized.current) {
      map.setView([last.lat, last.lng], 16)
      initialized.current = true
    } else {
      map.panTo([last.lat, last.lng])
    }
  }, [map, waypoints])

  return null
}

export default function LiveMap({ waypoints }: { waypoints: Waypoint[] }) {
  const positions = waypoints.map((wp): [number, number] => [wp.lat, wp.lng])
  const lastPos = positions.length > 0 ? positions[positions.length - 1] : undefined
  const center = lastPos || [40.7128, -74.006] as [number, number]

  return (
    <MapContainer
      center={center}
      zoom={16}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {positions.length > 1 && (
        <Polyline positions={positions} color="#10b981" weight={4} />
      )}
      {lastPos && (
        <Marker position={lastPos} icon={defaultIcon} />
      )}
      <MapUpdater waypoints={waypoints} />
    </MapContainer>
  )
}
