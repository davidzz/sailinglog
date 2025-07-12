import { NextRequest, NextResponse } from 'next/server'
import { getHistoricalWeather } from '@/lib/weather'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lon = parseFloat(searchParams.get('lon') || '0')
    const timestamp = parseInt(searchParams.get('timestamp') || '0')

    if (!lat || !lon || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required parameters: lat, lon, timestamp' },
        { status: 400 }
      )
    }

    const weatherData = await getHistoricalWeather(lat, lon, timestamp)
    
    if (!weatherData) {
      return NextResponse.json(
        { error: 'Weather data not available' },
        { status: 404 }
      )
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error('Error in weather API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}