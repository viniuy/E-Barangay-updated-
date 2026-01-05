'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MainDashboard } from '@/components/user/UserMainDashboard';
import { ServiceDirectory } from '@/components/user/services/UserServiceDirectory';
import { ServiceForm } from '@/components/user/services/UserServiceForm';
import { UserRequests } from '@/components/user/UserRequests';
import GuestMainDashboard from '@/components/GuestLanding'; // Import your new guest dashboard
import { useAuth } from '@/lib/hooks/useAuth';

// Dynamically import FacilitiesDirectory to avoid SSR issues with Leaflet
const FacilitiesDirectory = dynamic(
  () =>
    import('@/components/user/facilities/UserFacilitiesDirectory').then(
      (mod) => ({
        default: mod.FacilitiesDirectory,
      }),
    ),
  { ssr: false },
);

type View =
  | 'dashboard'
  | 'services'
  | 'facilities'
  | 'application'
  | 'requests';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (user?.role === 'staff') {
      router.push('/admin');
      return;
    }
    setLoading(false);
    // Clear post-login flag once auth is loaded
    if (sessionStorage.getItem('isPostLogin')) {
      sessionStorage.removeItem('isPostLogin');
    }
  }, [authLoading, user, router]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <MainDashboard
            onNavigate={setCurrentView}
            onSelectService={(service) => {
              setSelectedService(service);
              setCurrentView('application');
            }}
          />
        );
      case 'services':
        return (
          <ServiceDirectory
            onNavigate={setCurrentView}
            onSelectService={(service) => {
              setSelectedService(service);
              setCurrentView('application');
            }}
          />
        );
      case 'facilities':
        return (
          <FacilitiesDirectory
            onNavigate={setCurrentView}
            onSelectFacility={(service) => {
              setSelectedService(service);
              setCurrentView('application');
            }}
          />
        );
      case 'application':
        return (
          <ServiceForm service={selectedService} onNavigate={setCurrentView} />
        );
      case 'requests':
        return <UserRequests onNavigate={setCurrentView} />;
      default:
        return <MainDashboard onNavigate={setCurrentView} />;
    }
  };

  if (loading || authLoading) {
    const isPostLogin =
      typeof window !== 'undefined' && sessionStorage.getItem('isPostLogin');
    if (isPostLogin) {
      return (
        <div className='min-h-screen bg-gradient-to-b from-blue-50 to-gray-200 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto'></div>
            <p className='mt-6 text-lg font-medium text-gray-900'>
              Logging you in...
            </p>
            <p className='mt-2 text-sm text-gray-600'>
              Please wait while we update your session
            </p>
          </div>
        </div>
      );
    }
    // If not post-login, do nothing (no loading screen) - proceed to render the rest of the component
  }

  // If authenticated, redirect to /user
  if (user && !authLoading) {
    router.replace('/user');
    return null;
  }

  // If not authenticated, show login/signup landing
  if (!user && !authLoading) {
    return <GuestMainDashboard />;
  }

  return <div className='min-h-screen bg-background'>{renderView()}</div>;
}
