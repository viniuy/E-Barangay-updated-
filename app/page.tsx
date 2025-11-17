'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { MainDashboard } from '@/components/user/UserMainDashboard'
import { ServiceDirectory } from '@/components/user/UserServiceDirectory'
import { ServiceForm } from '@/components/user/UserServiceForm'
import { UserRequests } from '@/components/user/UserRequests'

// Dynamically import FacilitiesDirectory to avoid SSR issues with Leaflet
const FacilitiesDirectory = dynamic(
  () => import('@/components/user/UserFacilitiesDirectory').then(mod => ({ default: mod.FacilitiesDirectory })),
  { ssr: false }
)

type View = 'dashboard' | 'services' | 'facilities' | 'application' | 'requests'

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [selectedService, setSelectedService] = useState<string | null>(null)

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

  return <div className="min-h-screen bg-background">{renderView()}</div>
}

