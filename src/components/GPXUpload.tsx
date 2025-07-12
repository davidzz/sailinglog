'use client'

import { useState } from 'react'
import { parseGPX, calculateStats } from '@/lib/gpx-parser'

interface GPXUploadProps {
  onUploadSuccess: () => void
}

export function GPXUpload({ onUploadSuccess }: GPXUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFileUpload = async (file: File) => {
    // Skip auth check in demo mode

    setUploading(true)
    try {
      const content = await file.text()
      const gpxData = parseGPX(content)
      
      if (gpxData.tracks.length === 0) {
        throw new Error('No tracks found in GPX file')
      }
      
      const trackPoints = gpxData.tracks[0].segments[0]?.points || []
      const stats = calculateStats(trackPoints)
      
      if (!stats) {
        throw new Error('Unable to calculate track statistics')
      }
      
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: gpxData.name,
          gpxData: content,
          trackPoints,
          ...stats,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save session')
      }
      
      onUploadSuccess()
    } catch (error) {
      console.error('Upload error:', error)
      console.error('Error details:', error.message)
      alert(`Error uploading GPX file: ${error.message}. Please check console for details.`)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const gpxFile = files.find(file => file.name.toLowerCase().endsWith('.gpx'))
    
    if (gpxFile) {
      handleFileUpload(gpxFile)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
      >
        {uploading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        ) : (
          <>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Drop your GPX file here, or{' '}
              <label className="text-primary-600 hover:text-primary-500 cursor-pointer">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept=".gpx"
                  onChange={handleFileInput}
                />
              </label>
            </p>
            <p className="text-xs text-gray-500 mt-1">GPX files only</p>
          </>
        )}
      </div>
    </div>
  )
}