import { WeatherData } from '@/types'

export async function getHistoricalWeather(
  lat: number,
  lon: number,
  timestamp: number
): Promise<WeatherData | null> {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      console.warn('OpenWeather API key not configured')
      return null
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${Math.floor(timestamp / 1000)}&appid=${apiKey}&units=metric`
    )

    if (!response.ok) {
      console.error('Weather API request failed:', response.status)
      return null
    }

    const data = await response.json()
    const current = data.data?.[0]

    if (!current) {
      return null
    }

    return {
      windSpeed: current.wind_speed || 0,
      windDirection: current.wind_deg || 0,
      temperature: current.temp || 0,
      humidity: current.humidity || 0,
      pressure: current.pressure || 0,
      conditions: current.weather?.[0]?.description || 'Unknown'
    }
  } catch (error) {
    console.error('Error fetching weather data:', error)
    return null
  }
}

export function formatWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

export function knotsToMps(knots: number): number {
  return knots * 0.514444
}

export function mpsToKnots(mps: number): number {
  return mps / 0.514444
}