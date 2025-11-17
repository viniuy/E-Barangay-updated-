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
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (authLoading) return
    if (user?.role === 'staff') {
      router.push('/admin')
      return
    }
    setLoading(false)
  }, [authLoading, user, router])

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

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <div className="min-h-screen bg-background">{renderView()}</div>
}

