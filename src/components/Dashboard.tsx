'use client'

import { useState, useEffect } from 'react'
import { SailingSession } from '@/types'
import { SessionCard } from './SessionCard'
import { GPXUpload } from './GPXUpload'
import { SessionDetail } from './SessionDetail'

export function Dashboard() {
  // Mock user for demo purposes
  const session = { user: { name: 'Demo User', email: 'demo@example.com', image: null } }
  const [sessions, setSessions] = useState<SailingSession[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions')
      if (response.ok) {
        const data = await response.json()
        setSessions(data)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const handleUploadSuccess = () => {
    setShowUpload(false)
    fetchSessions()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // Show session detail if one is selected
  if (selectedSessionId) {
    return (
      <SessionDetail 
        sessionId={selectedSessionId} 
        onBack={() => setSelectedSessionId(null)} 
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">SailingLog</h1>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Upload GPX
              </button>
              
              <div className="flex items-center space-x-3">
                <span className="text-gray-700">{session?.user?.name}</span>
                <span className="text-xs text-gray-500">(Demo Mode)</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showUpload && (
          <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Upload New Session</h2>
            <GPXUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sailing sessions</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by uploading your first GPX file.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowUpload(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Upload GPX
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Sailing Sessions ({sessions.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onClick={() => setSelectedSessionId(session.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}