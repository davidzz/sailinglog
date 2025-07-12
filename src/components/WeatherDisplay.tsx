'use client'

import { WeatherData } from '@/types'
import { formatWindDirection, mpsToKnots } from '@/lib/weather'

interface WeatherDisplayProps {
  weather: WeatherData
  className?: string
}

export function WeatherDisplay({ weather, className = '' }: WeatherDisplayProps) {
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
        Weather Conditions
      </h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Wind</span>
          <div className="font-medium">
            {mpsToKnots(weather.windSpeed).toFixed(1)} kts {formatWindDirection(weather.windDirection)}
          </div>
        </div>
        
        <div>
          <span className="text-gray-600">Temperature</span>
          <div className="font-medium">{weather.temperature.toFixed(1)}°C</div>
        </div>
        
        <div>
          <span className="text-gray-600">Humidity</span>
          <div className="font-medium">{weather.humidity}%</div>
        </div>
        
        <div>
          <span className="text-gray-600">Pressure</span>
          <div className="font-medium">{weather.pressure} hPa</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <span className="text-gray-600 text-sm">Conditions</span>
        <div className="font-medium capitalize">{weather.conditions}</div>
      </div>
    </div>
  )
}