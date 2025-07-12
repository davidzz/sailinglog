import { TrackPoint, GPXData } from '@/types'

export function parseGPX(gpxContent: string): GPXData {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(gpxContent, 'text/xml')
  
  const tracks = Array.from(xmlDoc.querySelectorAll('trk')).map(track => {
    const name = track.querySelector('name')?.textContent || 'Unnamed Track'
    
    const segments = Array.from(track.querySelectorAll('trkseg')).map(segment => {
      const points: TrackPoint[] = Array.from(segment.querySelectorAll('trkpt')).map(point => {
        const lat = parseFloat(point.getAttribute('lat') || '0')
        const lon = parseFloat(point.getAttribute('lon') || '0')
        const timeElement = point.querySelector('time')
        const time = timeElement ? new Date(timeElement.textContent || '') : new Date()
        const elevationElement = point.querySelector('ele')
        const elevation = elevationElement ? parseFloat(elevationElement.textContent || '0') : undefined
        
        return { lat, lon, time, elevation }
      })
      
      return { points }
    })
    
    return { name, segments }
  })
  
  const name = xmlDoc.querySelector('trk name')?.textContent || 'Unnamed Activity'
  
  return { name, tracks }
}

export function calculateStats(trackPoints: TrackPoint[]) {
  if (trackPoints.length === 0) return null
  
  let totalDistance = 0
  let maxSpeed = 0
  let totalSpeed = 0
  let speedCount = 0
  
  for (let i = 1; i < trackPoints.length; i++) {
    const prev = trackPoints[i - 1]
    const curr = trackPoints[i]
    
    const distance = haversineDistance(prev.lat, prev.lon, curr.lat, curr.lon)
    totalDistance += distance
    
    const timeDiff = (curr.time.getTime() - prev.time.getTime()) / 1000
    if (timeDiff > 0) {
      const speed = (distance / timeDiff) * 3.6
      if (speed > 0 && speed < 100) {
        totalSpeed += speed
        speedCount++
        maxSpeed = Math.max(maxSpeed, speed)
      }
    }
  }
  
  const duration = (trackPoints[trackPoints.length - 1].time.getTime() - trackPoints[0].time.getTime()) / 1000
  const avgSpeed = speedCount > 0 ? totalSpeed / speedCount : 0
  
  return {
    distance: totalDistance / 1000,
    duration,
    maxSpeed,
    avgSpeed
  }
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lon2 - lon1) * Math.PI / 180
  
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
  return R * c
}