'use client'

import { WeatherData, TrackPoint } from '@/types'

interface WeatherDisplayProps {
  weatherData?: WeatherData | null
  date: Date
  trackPoints: TrackPoint[]
  className?: string
}

export function WeatherDisplay({ weatherData, date, trackPoints, className = '' }: WeatherDisplayProps) {
  if (!weatherData) {
    return (
      <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          Weather Conditions
        </h3>
        <p className="text-gray-500">No weather data available for this session</p>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Weather data can be fetched automatically for future sessions to provide insights about sailing conditions.
          </p>
        </div>
      </div>
    )
  }
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
            {weatherData.windSpeed.toFixed(1)} m/s {weatherData.windDirection}°
          </div>
        </div>
        
        <div>
          <span className="text-gray-600">Temperature</span>
          <div className="font-medium">{weatherData.temperature.toFixed(1)}°C</div>
        </div>
        
        <div>
          <span className="text-gray-600">Humidity</span>
          <div className="font-medium">{weatherData.humidity}%</div>
        </div>
        
        <div>
          <span className="text-gray-600">Pressure</span>
          <div className="font-medium">{weatherData.pressure} hPa</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <span className="text-gray-600 text-sm">Conditions</span>
        <div className="font-medium capitalize">{weatherData.conditions}</div>
      </div>
    </div>
  )
}