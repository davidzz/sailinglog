import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection with a simple count query
    const count = await prisma.sailingSession.count()
    return NextResponse.json({ 
      status: 'Database connected', 
      sessionCount: count,
      dbUrl: process.env.DATABASE_URL 
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      error: 'Database connection failed', 
      details: error.message,
      dbUrl: process.env.DATABASE_URL 
    }, { status: 500 })
  }
}