import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await prisma.sailingSession.findUnique({
      where: {
        id: params.id,
      },
      include: {
        trackPoints: {
          orderBy: {
            time: 'asc'
          }
        }
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Parse weather data if it exists
    let weatherData = null
    if (session.weatherData) {
      try {
        weatherData = JSON.parse(session.weatherData)
      } catch (e) {
        console.error('Error parsing weather data:', e)
      }
    }

    // Format the response
    const formattedSession = {
      ...session,
      weatherData,
      trackPoints: session.trackPoints.map(point => ({
        ...point,
        time: point.time.toISOString()
      }))
    }

    return NextResponse.json(formattedSession)
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}