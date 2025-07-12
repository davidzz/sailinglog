'use client'

import { Dashboard } from '@/components/Dashboard'

export default function Home() {
  // Skip auth for now - go straight to dashboard
  return <Dashboard />
}