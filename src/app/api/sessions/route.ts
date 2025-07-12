import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { TrackPoint } from '@/types'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        sailingSessions: {
          orderBy: { date: 'desc' },
          include: {
            trackPoints: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user.sailingSessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, gpxData, trackPoints, distance, duration, maxSpeed, avgSpeed } = body

    const sailingSession = await prisma.sailingSession.create({
      data: {
        userId: user.id,
        name,
        date: new Date(trackPoints[0]?.time || Date.now()),
        duration,
        distance,
        maxSpeed,
        avgSpeed,
        gpxData,
        trackPoints: {
          create: trackPoints.map((point: TrackPoint) => ({
            lat: point.lat,
            lon: point.lon,
            time: new Date(point.time),
            speed: point.speed,
            elevation: point.elevation
          }))
        }
      },
      include: {
        trackPoints: true
      }
    })

    return NextResponse.json(sailingSession)
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}