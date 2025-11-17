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
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (authLoading) return
    if (!user || user.role !== 'staff') {
      router.push('/')
      return
    }
    setUserRole(user.role)
    setLoading(false)
  }, [authLoading, user, router])

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

