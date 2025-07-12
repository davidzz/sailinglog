'use client'

import { useState } from 'react'

interface ShareButtonProps {
  sessionId: string
  isShared: boolean
  onShare: (shareUrl: string) => void
  onUnshare: () => void
}

export function ShareButton({ sessionId, isShared, onShare, onUnshare }: ShareButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleShare = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/share/${sessionId}`, {
        method: 'POST'
      })

      if (response.ok) {
        const { shareUrl } = await response.json()
        onShare(shareUrl)
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
        onUnshare()
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
      onClick={isShared ? handleUnshare : handleShare}
      disabled={loading}
      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
        isShared
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? '...' : isShared ? 'Unshare' : 'Share'}
    </button>
  )
}