'use client'

import { SailingSession } from '@/types'
import { SailingMap } from './SailingMap'

interface SessionCardProps {
  session: SailingSession
  onClick?: () => void
}

export function SessionCard({ session, onClick }: SessionCardProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <SailingMap trackPoints={session.trackPoints} className="h-48" />
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.name}</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="block text-gray-900 font-medium">{session.distance.toFixed(1)} km</span>
            <span>Distance</span>
          </div>
          
          <div>
            <span className="block text-gray-900 font-medium">{formatDuration(session.duration)}</span>
            <span>Duration</span>
          </div>
          
          <div>
            <span className="block text-gray-900 font-medium">{session.maxSpeed.toFixed(1)} kts</span>
            <span>Max Speed</span>
          </div>
          
          <div>
            <span className="block text-gray-900 font-medium">{session.avgSpeed.toFixed(1)} kts</span>
            <span>Avg Speed</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">{formatDate(session.date)}</span>
        </div>
      </div>
    </div>
  )
}