import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
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

    const sailingSession = await prisma.sailingSession.findFirst({
      where: {
        id: params.sessionId,
        userId: user.id
      }
    })

    if (!sailingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const shareToken = randomBytes(32).toString('hex')

    const updatedSession = await prisma.sailingSession.update({
      where: { id: params.sessionId },
      data: {
        isPublic: true,
        shareToken
      }
    })

    return NextResponse.json({
      shareUrl: `${process.env.NEXTAUTH_URL}/shared/${shareToken}`
    })
  } catch (error) {
    console.error('Error sharing session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
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

    const sailingSession = await prisma.sailingSession.findFirst({
      where: {
        id: params.sessionId,
        userId: user.id
      }
    })

    if (!sailingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    await prisma.sailingSession.update({
      where: { id: params.sessionId },
      data: {
        isPublic: false,
        shareToken: null
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unsharing session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}