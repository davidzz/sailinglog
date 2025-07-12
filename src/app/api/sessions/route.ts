import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { TrackPoint } from '@/types'

export async function GET() {
  try {
    // Demo mode - return demo sessions or empty array
    const sessions = await prisma.sailingSession.findMany({
      orderBy: { date: 'desc' },
      include: {
        trackPoints: true
      }
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Starting session creation ===')
    
    // Demo mode - create session without user auth
    const body = await request.json()
    console.log('Request body received:', { 
      name: body.name, 
      trackPointsCount: body.trackPoints?.length,
      distance: body.distance,
      duration: body.duration 
    })
    
    const { name, gpxData, trackPoints, distance, duration, maxSpeed, avgSpeed } = body

    // Ensure demo user exists
    let demoUser = await prisma.user.findUnique({
      where: { email: 'demo@example.com' }
    })
    
    if (!demoUser) {
      console.log('Creating demo user...')
      demoUser = await prisma.user.create({
        data: {
          id: 'demo-user',
          email: 'demo@example.com',
          name: 'Demo User'
        }
      })
      console.log('Demo user created')
    }

    console.log('Creating session with data:', {
      userId: demoUser.id,
      name,
      date: new Date(trackPoints[0]?.time || Date.now()),
      duration,
      distance,
      maxSpeed,
      avgSpeed,
      trackPointsCount: trackPoints.length
    })

    // Create session without track points first to isolate issue
    const sailingSession = await prisma.sailingSession.create({
      data: {
        userId: demoUser.id,
        name,
        date: new Date(trackPoints[0]?.time || Date.now()),
        duration,
        distance,
        maxSpeed,
        avgSpeed,
        gpxData
      }
    })
    
    console.log('Session created successfully:', sailingSession.id)

    // Now add track points
    for (const point of trackPoints) {
      await prisma.trackPoint.create({
        data: {
          sessionId: sailingSession.id,
          lat: point.lat,
          lon: point.lon,
          time: new Date(point.time),
          speed: point.speed,
          elevation: point.elevation
        }
      })
    }
    
    console.log('Track points added successfully')

    // Fetch complete session with track points
    const completeSession = await prisma.sailingSession.findUnique({
      where: { id: sailingSession.id },
      include: { trackPoints: true }
    })

    return NextResponse.json(completeSession)
  } catch (error) {
    console.error('=== Error creating session ===')
    console.error('Error:', error)
    console.error('Error details:', error?.message)
    console.error('Error code:', error?.code)
    console.error('Stack trace:', error?.stack)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error?.message || 'Unknown error',
      code: error?.code
    }, { status: 500 })
  }
}