import { useState } from 'react';
import { MainDashboard } from './components/user/UserMainDashboard';
import { ServiceDirectory } from './components/user/UserServiceDirectory';
import { FacilitiesDirectory } from './components/user/UserFacilitiesDirectory';
import { ServiceForm } from './components/user/UserServiceForm';

type View = 'dashboard' | 'services' | 'facilities' | 'application';


export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedService, setSelectedService] = useState<string | null>(null);


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
          <ServiceForm
            service={selectedService}
            onNavigate={setCurrentView} 
          />
        );
      default:
        return <MainDashboard onNavigate={setCurrentView} />;
    }
  };

  return (
        <div className="min-h-screen bg-background">
          {renderView()}
        </div>

  );
}