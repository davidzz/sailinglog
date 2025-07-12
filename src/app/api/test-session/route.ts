import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('Testing simple session creation...')
    
    const session = await prisma.sailingSession.create({
      data: {
        userId: 'test-user',
        name: 'Test Session',
        date: new Date(),
        duration: 3600,
        distance: 5.0,
        maxSpeed: 10.0,
        avgSpeed: 6.0,
        gpxData: '<gpx>test</gpx>'
      }
    })
    
    console.log('Session created:', session.id)
    return NextResponse.json({ success: true, sessionId: session.id })
  } catch (error) {
    console.error('Test session error:', error)
    return NextResponse.json({ 
      error: error.message,
      code: error.code 
    }, { status: 500 })
  }
}