'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MainDashboard } from '@/components/admin/AdminMainDashboard'
import { AdminDirectory } from '@/components/admin/AdminDirectory'
import { AdminRequestManagement } from '@/components/admin/AdminRequestManagement'
import dynamic from 'next/dynamic'
import { useAuth } from '@/lib/hooks/useAuth'

// Dynamically import to avoid SSR issues
const AdminDirectoryDynamic = dynamic(
  () => import('@/components/admin/AdminDirectory').then(mod => ({ default: mod.AdminDirectory })),
  { ssr: false }
)

type View = 'dashboard' | 'directory' | 'requests'

export default function AdminPage() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [userRole, setUserRole] = useState<string | null>(null)
  // Check if we're in post-login mode - if so, don't show initial loading
  const isPostLogin = typeof window !== 'undefined' && sessionStorage.getItem('isPostLogin')
  const [loading, setLoading] = useState(!isPostLogin) // Only show initial loading if not post-login
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    // If we're in post-login mode, we only wait for authLoading
    if (isPostLogin) {
      if (!authLoading) {
        setLoading(false)
        // Clear post-login flag once auth is loaded
        sessionStorage.removeItem('isPostLogin')
      }
      return
    }
    
    // Normal loading flow
    if (authLoading) return
    if (!user || user.role !== 'staff') {
      router.push('/')
      return
    }
    setUserRole(user.role)
    setLoading(false)
  }, [authLoading, user, router, isPostLogin])

  // Show post-login loading screen if in post-login mode
  if (isPostLogin && (loading || authLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-900">
            Logging you in...
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we update your session
          </p>
        </div>
      </div>
    )
  }

  // Show regular loading screen only if not in post-login mode
  if ((loading || authLoading) && !isPostLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-900">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  if (userRole !== 'staff') {
    return null
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <MainDashboard
            onNavigate={setCurrentView}
          />
        )
      case 'directory':
        return (
          <AdminDirectoryDynamic
            onNavigate={setCurrentView}
          />
        )
      case 'requests':
        return (
          <AdminRequestManagement
            onNavigate={setCurrentView}
          />
        )
      default:
        return <MainDashboard onNavigate={setCurrentView} />
    }
  }

  return <div className="min-h-screen bg-background">{renderView()}</div>
}

