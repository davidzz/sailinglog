'use client'

import { PerformanceMetrics } from '@/lib/analytics'

interface PerformanceInsightsProps {
  metrics: PerformanceMetrics
  className?: string
}

export function PerformanceInsights({ metrics, className = '' }: PerformanceInsightsProps) {
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
          <span className="text-gray-600">Tack Efficiency</span>
          <div className="font-medium">{metrics.efficiency.toFixed(1)}%</div>
        </div>
        
        <div>
          <span className="text-gray-600">Tacks/Jibes</span>
          <div className="font-medium">{metrics.tacks}/{metrics.jibes}</div>
        </div>
        
        <div>
          <span className="text-gray-600">Port Time</span>
          <div className="font-medium">{metrics.timeOnPort.toFixed(1)} min</div>
        </div>
        
        <div>
          <span className="text-gray-600">Starboard Time</span>
          <div className="font-medium">{metrics.timeOnStarboard.toFixed(1)} min</div>
        </div>
        
        {metrics.avgSpeedUpwind > 0 && (
          <>
            <div>
              <span className="text-gray-600">Upwind Speed</span>
              <div className="font-medium">{metrics.avgSpeedUpwind.toFixed(1)} kts</div>
            </div>
            
            <div>
              <span className="text-gray-600">Upwind VMG</span>
              <div className="font-medium">{metrics.vmgUpwind.toFixed(1)} kts</div>
            </div>
          </>
        )}
        
        {metrics.avgSpeedDownwind > 0 && (
          <>
            <div>
              <span className="text-gray-600">Downwind Speed</span>
              <div className="font-medium">{metrics.avgSpeedDownwind.toFixed(1)} kts</div>
            </div>
            
            <div>
              <span className="text-gray-600">Downwind VMG</span>
              <div className="font-medium">{metrics.vmgDownwind.toFixed(1)} kts</div>
            </div>
          </>
        )}
      </div>
      
      {metrics.insights.length > 0 && (
        <div className="border-t border-gray-100 pt-3">
          <h4 className="font-medium text-gray-900 mb-2">Insights</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            {metrics.insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}