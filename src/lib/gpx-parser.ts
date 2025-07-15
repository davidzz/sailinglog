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
  
  console.log('Calculating stats for', trackPoints.length, 'points')
  
  let totalDistance = 0
  const speeds: number[] = []
  
  // Calculate speeds with better filtering
  for (let i = 1; i < trackPoints.length; i++) {
    const prev = trackPoints[i - 1]
    const curr = trackPoints[i]
    
    const distance = haversineDistance(prev.lat, prev.lon, curr.lat, curr.lon)
    totalDistance += distance
    
    const timeDiff = (curr.time.getTime() - prev.time.getTime()) / 1000
    
    // Only calculate speed if we have a reasonable time gap (5-60 seconds)
    // This helps filter out GPS noise from very close points
    if (timeDiff >= 5 && timeDiff <= 60) {
      // Convert m/s to knots: (distance in meters / time in seconds) * 1.94384
      const speedKnots = (distance / timeDiff) * 1.94384
      
      // Filter out unrealistic speeds and very low speeds (GPS drift)
      if (speedKnots >= 0.5 && speedKnots <= 25) { // Reasonable sailing speeds
        speeds.push(speedKnots)
      }
    }
  }
  
  // Calculate smoothed max speed using 95th percentile to avoid GPS spikes
  let maxSpeed = 0
  let avgSpeed = 0
  
  if (speeds.length > 0) {
    speeds.sort((a, b) => a - b)
    
    // Use 95th percentile as max speed to filter out GPS spikes
    const percentile95Index = Math.floor(speeds.length * 0.95)
    maxSpeed = speeds[percentile95Index] || 0
    
    // Average of all valid speeds
    avgSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length
  }
  
  const duration = (trackPoints[trackPoints.length - 1].time.getTime() - trackPoints[0].time.getTime()) / 1000
  
  // Convert distance from meters to nautical miles (1 nautical mile = 1852 meters)
  const distanceNauticalMiles = totalDistance / 1852
  
  console.log(`Calculated stats: ${speeds.length} valid speed readings, max: ${maxSpeed.toFixed(1)} kts, avg: ${avgSpeed.toFixed(1)} kts`)
  
  return {
    distance: distanceNauticalMiles,
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