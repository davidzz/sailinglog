export interface TrackPoint {
  lat: number
  lon: number
  time: Date
  speed?: number
  elevation?: number
}

export interface SailingSession {
  id: string
  userId: string
  name: string
  date: Date
  duration: number
  distance: number
  maxSpeed: number
  avgSpeed: number
  trackPoints: TrackPoint[]
  weatherData?: WeatherData
  isPublic: boolean
  shareToken?: string
}

export interface WeatherData {
  windSpeed: number
  windDirection: number
  temperature: number
  humidity: number
  pressure: number
  conditions: string
}

export interface GPXData {
  name: string
  tracks: Array<{
    name: string
    segments: Array<{
      points: TrackPoint[]
    }>
  }>
}

export interface User {
  id: string
  email: string
  name: string
  image?: string
  sessions: SailingSession[]
}