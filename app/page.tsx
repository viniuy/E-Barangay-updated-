'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { MainDashboard } from '@/components/user/UserMainDashboard'
import { ServiceDirectory } from '@/components/user/UserServiceDirectory'
import { ServiceForm } from '@/components/user/UserServiceForm'
import { UserRequests } from '@/components/user/UserRequests'
import { useAuth } from '@/lib/hooks/useAuth'

// Dynamically import FacilitiesDirectory to avoid SSR issues with Leaflet
const FacilitiesDirectory = dynamic(
  () => import('@/components/user/UserFacilitiesDirectory').then(mod => ({ default: mod.FacilitiesDirectory })),
  { ssr: false }
)

type View = 'dashboard' | 'services' | 'facilities' | 'application' | 'requests'

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [selectedService, setSelectedService] = useState<string | null>(null)
  // Check if we're in post-login mode - if so, don't show initial loading
  const isPostLogin = typeof window !== 'undefined' && sessionStorage.getItem('isPostLogin')
  const [loading, setLoading] = useState(!isPostLogin) // Only show initial loading if not post-login
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

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
    if (user?.role === 'staff') {
      router.push('/admin')
      return
    }
    setLoading(false)
  }, [authLoading, user, router, isPostLogin])

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <MainDashboard
            onNavigate={setCurrentView}
            onSelectService={(service) => {
              setSelectedService(service)
              setCurrentView('application')
            }}
          />
        )
      case 'services':
        return (
          <ServiceDirectory
            onNavigate={setCurrentView}
            onSelectService={(service) => {
              setSelectedService(service)
              setCurrentView('application')
            }}
          />
        )
      case 'facilities':
        return (
          <FacilitiesDirectory
            onNavigate={setCurrentView}
            onSelectFacility={(service) => {
              setSelectedService(service)
              setCurrentView('application')
            }}
          />
        )
      case 'application':
        return (
          <ServiceForm
            service={selectedService}
            onNavigate={setCurrentView}
          />
        )
      case 'requests':
        return (
          <UserRequests
            onNavigate={setCurrentView}
          />
        )
      default:
        return <MainDashboard onNavigate={setCurrentView} />
    }
  }

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

  return <div className="min-h-screen bg-background">{renderView()}</div>
}

