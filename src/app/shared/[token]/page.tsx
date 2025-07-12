import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SailingMap } from '@/components/SailingMap'
import { WeatherDisplay } from '@/components/WeatherDisplay'
import { PerformanceInsights } from '@/components/PerformanceInsights'
import { analyzePerformance } from '@/lib/analytics'

interface PageProps {
  params: { token: string }
}

export default async function SharedSessionPage({ params }: PageProps) {
  const session = await prisma.sailingSession.findFirst({
    where: {
      shareToken: params.token,
      isPublic: true
    },
    include: {
      trackPoints: true,
      user: {
        select: {
          name: true
        }
      }
    }
  })

  if (!session) {
    notFound()
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const weatherData = session.weatherData ? JSON.parse(session.weatherData) : null
  const performance = analyzePerformance(session.trackPoints, weatherData)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">{session.name}</h1>
            <p className="text-gray-600 mt-2">
              Sailed by {session.user.name} on {formatDate(session.date)}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <SailingMap trackPoints={session.trackPoints} className="h-96" />

          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-primary-600">
                {session.distance.toFixed(1)} km
              </div>
              <div className="text-gray-600 text-sm">Distance</div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-primary-600">
                {formatDuration(session.duration)}
              </div>
              <div className="text-gray-600 text-sm">Duration</div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-primary-600">
                {session.maxSpeed.toFixed(1)} kts
              </div>
              <div className="text-gray-600 text-sm">Max Speed</div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-primary-600">
                {session.avgSpeed.toFixed(1)} kts
              </div>
              <div className="text-gray-600 text-sm">Avg Speed</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {weatherData && <WeatherDisplay weather={weatherData} />}
            <PerformanceInsights metrics={performance} />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm text-center border-t-4 border-primary-500">
            <h3 className="text-lg font-semibold mb-2">Love sailing?</h3>
            <p className="text-gray-600 mb-4">
              Track your own sailing adventures with SailingLog
            </p>
            <a
              href="/"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-block"
            >
              Get Started
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}