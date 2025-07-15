'use client'

import { SailingSession } from '@/types'
import { useMemo } from 'react'

interface PerformanceInsightsProps {
  session: SailingSession
  className?: string
}

export function PerformanceInsights({ session, className = '' }: PerformanceInsightsProps) {
  const metrics = useMemo(() => {
    // Calculate basic performance metrics from track points
    const trackPoints = session.trackPoints
    if (trackPoints.length < 2) return null

    let totalTurns = 0
    let previousBearing = 0
    
    // Simple turn detection
    for (let i = 1; i < trackPoints.length - 1; i++) {
      const bearing = calculateBearing(trackPoints[i-1], trackPoints[i])
      if (previousBearing !== 0) {
        const bearingDiff = Math.abs(bearing - previousBearing)
        if (bearingDiff > 30 && bearingDiff < 330) { // Significant turn
          totalTurns++
        }
      }
      previousBearing = bearing
    }

    // Calculate speed distribution
    const speeds = trackPoints
      .map(point => point.speed || 0)
      .filter(speed => speed > 0)
    
    const avgSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0
    const maxSpeed = Math.max(...speeds, 0)
    
    return {
      totalTurns,
      avgSpeed,
      maxSpeed,
      trackPoints: trackPoints.length,
      duration: session.duration,
      distance: session.distance
    }
  }, [session])

  const calculateBearing = (point1: any, point2: any) => {
    const lat1 = point1.lat * Math.PI / 180
    const lat2 = point2.lat * Math.PI / 180
    const deltaLon = (point2.lon - point1.lon) * Math.PI / 180
    
    const x = Math.sin(deltaLon) * Math.cos(lat2)
    const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon)
    
    return (Math.atan2(x, y) * 180 / Math.PI + 360) % 360
  }

  if (!metrics) {
    return (
      <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
        <p className="text-gray-500">Not enough data for performance analysis</p>
      </div>
    )
  }
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Performance Analysis
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-600">Track Points</span>
          <div className="font-medium">{metrics.trackPoints}</div>
        </div>
        
        <div>
          <span className="text-gray-600">Direction Changes</span>
          <div className="font-medium">{metrics.totalTurns}</div>
        </div>
        
        <div>
          <span className="text-gray-600">Avg Speed</span>
          <div className="font-medium">{metrics.avgSpeed.toFixed(1)} kts</div>
        </div>
        
        <div>
          <span className="text-gray-600">Max Speed</span>
          <div className="font-medium">{metrics.maxSpeed.toFixed(1)} kts</div>
        </div>
        
        <div>
          <span className="text-gray-600">Distance</span>
          <div className="font-medium">{metrics.distance.toFixed(1)} nm</div>
        </div>
        
        <div>
          <span className="text-gray-600">Duration</span>
          <div className="font-medium">{Math.floor(metrics.duration / 60)}m {metrics.duration % 60}s</div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-3">
        <h4 className="font-medium text-gray-900 mb-2">Performance Insights</h4>
        <ul className="space-y-1 text-sm text-gray-600">
          <li className="flex items-start">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {metrics.totalTurns > 20 ? 'High activity session with frequent direction changes' : 'Steady sailing with minimal course changes'}
          </li>
          <li className="flex items-start">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {metrics.avgSpeed > 15 ? 'Great average speed - conditions were favorable' : 'Moderate speeds - typical for recreational sailing'}
          </li>
          <li className="flex items-start">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Data quality: {metrics.trackPoints > 100 ? 'Excellent GPS tracking' : 'Basic GPS tracking'}
          </li>
        </ul>
      </div>
    </div>
  )
}