'use client'

import { useEffect, useRef } from 'react'
import { TrackPoint } from '@/types'

interface SailingMapProps {
  trackPoints: TrackPoint[]
  className?: string
}

export function SailingMap({ trackPoints, className = '' }: SailingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || trackPoints.length === 0) return

    const loadMap = async () => {
      const L = await import('leaflet')
      await import('leaflet/dist/leaflet.css')

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }

      const map = L.map(mapRef.current).setView([trackPoints[0].lat, trackPoints[0].lon], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      const polylinePoints = trackPoints.map(point => [point.lat, point.lon] as [number, number])
      
      const polyline = L.polyline(polylinePoints, {
        color: '#0ea5e9',
        weight: 4,
        opacity: 0.8
      }).addTo(map)

      const startIcon = L.divIcon({
        html: '<div style="background-color: #10b981; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        className: 'start-marker'
      })

      const endIcon = L.divIcon({
        html: '<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        className: 'end-marker'
      })

      L.marker([trackPoints[0].lat, trackPoints[0].lon], { icon: startIcon })
        .addTo(map)
        .bindPopup('Start')

      L.marker([trackPoints[trackPoints.length - 1].lat, trackPoints[trackPoints.length - 1].lon], { icon: endIcon })
        .addTo(map)
        .bindPopup('Finish')

      map.fitBounds(polyline.getBounds(), { padding: [20, 20] })

      mapInstanceRef.current = map
    }

    loadMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [trackPoints])

  if (trackPoints.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-500">No track data available</p>
      </div>
    )
  }

  return <div ref={mapRef} className={`h-64 w-full rounded-lg ${className}`} />
}