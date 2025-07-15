'use client'

import { useState, useEffect } from 'react'
import { SailingSession } from '@/types'
import { SailingMap } from './SailingMap'
import { WeatherDisplay } from './WeatherDisplay'
import { PerformanceInsights } from './PerformanceInsights'
import { ShareButton } from './ShareButton'

interface SessionDetailProps {
  sessionId: string
  onBack: () => void
}

export function SessionDetail({ sessionId, onBack }: SessionDetailProps) {
  const [session, setSession] = useState<SailingSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'weather'>('overview')

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/sessions/${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          setSession(data)
        }
      } catch (error) {
        console.error('Error fetching session:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Session not found</h2>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{session.name}</h1>
                <p className="text-gray-600">{formatDate(session.date)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ShareButton sessionId={session.id} isPublic={session.isPublic} />
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {session.distance.toFixed(1)} nm
            </div>
            <div className="text-sm text-gray-600">Distance</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {formatDuration(session.duration)}
            </div>
            <div className="text-sm text-gray-600">Duration</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-orange-600">
              {session.maxSpeed.toFixed(1)} kts
            </div>
            <div className="text-sm text-gray-600">Max Speed</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {session.avgSpeed.toFixed(1)} kts
            </div>
            <div className="text-sm text-gray-600">Avg Speed</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'analytics', label: 'Analytics' },
                { id: 'weather', label: 'Weather' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Route Map</h3>
                  <div className="h-96 rounded-lg overflow-hidden">
                    <SailingMap trackPoints={session.trackPoints} />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Session Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Time:</span>
                        <span className="font-medium">
                          {new Date(session.date).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Track Points:</span>
                        <span className="font-medium">{session.trackPoints.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Pace:</span>
                        <span className="font-medium">
                          {session.distance > 0 ? (session.duration / 60 / session.distance).toFixed(1) : '0'} min/nm
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <PerformanceInsights session={session} />
            )}

            {activeTab === 'weather' && (
              <WeatherDisplay 
                weatherData={session.weatherData} 
                date={session.date}
                trackPoints={session.trackPoints}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}