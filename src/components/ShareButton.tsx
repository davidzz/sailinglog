'use client'

import { useState } from 'react'

interface ShareButtonProps {
  sessionId: string
  isPublic: boolean
}

export function ShareButton({ sessionId, isPublic }: ShareButtonProps) {
  const [loading, setLoading] = useState(false)
  const [shared, setShared] = useState(isPublic)

  const handleShare = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/share/${sessionId}`, {
        method: 'POST'
      })

      if (response.ok) {
        const { shareUrl } = await response.json()
        setShared(true)
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl)
        alert('Share link copied to clipboard!')
      } else {
        alert('Failed to create share link')
      }
    } catch (error) {
      console.error('Error sharing session:', error)
      alert('Failed to create share link')
    } finally {
      setLoading(false)
    }
  }

  const handleUnshare = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/share/${sessionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setShared(false)
        alert('Session is no longer public')
      } else {
        alert('Failed to remove share link')
      }
    } catch (error) {
      console.error('Error unsharing session:', error)
      alert('Failed to remove share link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={shared ? handleUnshare : handleShare}
      disabled={loading}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        shared
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Loading...' : shared ? 'Make Private' : 'Share Session'}
    </button>
  )
}