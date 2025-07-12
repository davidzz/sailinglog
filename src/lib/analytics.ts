import { TrackPoint, WeatherData } from '@/types'

export interface PerformanceMetrics {
  efficiency: number
  tacks: number
  jibes: number
  timeOnPort: number
  timeOnStarboard: number
  avgSpeedUpwind: number
  avgSpeedDownwind: number
  vmgUpwind: number
  vmgDownwind: number
  insights: string[]
}

export function analyzePerformance(
  trackPoints: TrackPoint[],
  weather?: WeatherData
): PerformanceMetrics {
  if (trackPoints.length < 2) {
    return {
      efficiency: 0,
      tacks: 0,
      jibes: 0,
      timeOnPort: 0,
      timeOnStarboard: 0,
      avgSpeedUpwind: 0,
      avgSpeedDownwind: 0,
      vmgUpwind: 0,
      vmgDownwind: 0,
      insights: ['Insufficient data for analysis']
    }
  }

  const insights: string[] = []
  let tacks = 0
  let jibes = 0
  let timeOnPort = 0
  let timeOnStarboard = 0
  let upwindSpeeds: number[] = []
  let downwindSpeeds: number[] = []
  let upwindVMGs: number[] = []
  let downwindVMGs: number[] = []

  let prevCourse: number | null = null
  let currentTack: 'port' | 'starboard' | null = null

  for (let i = 1; i < trackPoints.length; i++) {
    const prev = trackPoints[i - 1]
    const curr = trackPoints[i]
    
    const course = calculateBearing(prev.lat, prev.lon, curr.lat, curr.lon)
    const speed = calculateSpeed(prev, curr)
    const timeDiff = (curr.time.getTime() - prev.time.getTime()) / 1000

    if (weather) {
      const windAngle = normalizeAngle(course - weather.windDirection)
      const vmg = speed * Math.cos((windAngle * Math.PI) / 180)
      
      if (windAngle > 135 || windAngle < -135) {
        downwindSpeeds.push(speed)
        downwindVMGs.push(Math.abs(vmg))
      } else if (windAngle < 45 && windAngle > -45) {
        upwindSpeeds.push(speed)
        upwindVMGs.push(Math.abs(vmg))
      }

      const newTack = windAngle > 0 ? 'starboard' : 'port'
      
      if (currentTack && currentTack !== newTack) {
        if (windAngle > 90 || windAngle < -90) {
          jibes++
        } else {
          tacks++
        }
      }
      
      currentTack = newTack
      
      if (currentTack === 'port') {
        timeOnPort += timeDiff
      } else {
        timeOnStarboard += timeDiff
      }
    }

    prevCourse = course
  }

  const avgSpeedUpwind = upwindSpeeds.length > 0 
    ? upwindSpeeds.reduce((a, b) => a + b, 0) / upwindSpeeds.length 
    : 0

  const avgSpeedDownwind = downwindSpeeds.length > 0 
    ? downwindSpeeds.reduce((a, b) => a + b, 0) / downwindSpeeds.length 
    : 0

  const vmgUpwind = upwindVMGs.length > 0 
    ? upwindVMGs.reduce((a, b) => a + b, 0) / upwindVMGs.length 
    : 0

  const vmgDownwind = downwindVMGs.length > 0 
    ? downwindVMGs.reduce((a, b) => a + b, 0) / downwindVMGs.length 
    : 0

  const totalTime = timeOnPort + timeOnStarboard
  const efficiency = totalTime > 0 ? Math.min(timeOnPort, timeOnStarboard) / totalTime * 100 : 0

  if (weather) {
    if (efficiency > 45) {
      insights.push('Good tack balance - you sailed nearly equal time on both tacks')
    } else if (efficiency < 30) {
      insights.push('Consider more balanced tacking - you favored one tack significantly')
    }

    if (vmgUpwind > avgSpeedUpwind * 0.8) {
      insights.push('Excellent upwind VMG - you\'re sailing close to optimal angles')
    } else if (vmgUpwind < avgSpeedUpwind * 0.6) {
      insights.push('Consider sailing closer to the wind or at better angles for improved upwind performance')
    }

    if (avgSpeedDownwind > avgSpeedUpwind * 1.5) {
      insights.push('Great downwind speed - you\'re making good use of the wind')
    }

    if (tacks > trackPoints.length / 50) {
      insights.push('Frequent tacking detected - consider longer tacks for better speed')
    }
  }

  return {
    efficiency,
    tacks,
    jibes,
    timeOnPort: timeOnPort / 60,
    timeOnStarboard: timeOnStarboard / 60,
    avgSpeedUpwind,
    avgSpeedDownwind,
    vmgUpwind,
    vmgDownwind,
    insights
  }
}

function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = (lon2 - lon1) * Math.PI / 180
  const lat1Rad = lat1 * Math.PI / 180
  const lat2Rad = lat2 * Math.PI / 180
  
  const y = Math.sin(dLon) * Math.cos(lat2Rad)
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon)
  
  const bearing = Math.atan2(y, x) * 180 / Math.PI
  return normalizeAngle(bearing)
}

function calculateSpeed(p1: TrackPoint, p2: TrackPoint): number {
  const distance = haversineDistance(p1.lat, p1.lon, p2.lat, p2.lon)
  const timeDiff = (p2.time.getTime() - p1.time.getTime()) / 1000
  
  if (timeDiff === 0) return 0
  
  return (distance / timeDiff) * 1.94384
}

function normalizeAngle(angle: number): number {
  while (angle > 180) angle -= 360
  while (angle < -180) angle += 360
  return angle
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