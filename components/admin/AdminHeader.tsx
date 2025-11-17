import { Menu, Landmark } from 'lucide-react';
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onNavigate: (view: 'dashboard' | 'services' | 'facilities' |  'application') => void;
}

export function Header({ onNavigate }: HeaderProps) {
  return (

    <div className="max-w-4xl mx-auto px-6">
      <div className="flex items-center justify-between rounded-full bg-white px-6 py-3 shadow-sm">
        
        {/* Logo + Title */}
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={() => onNavigate('dashboard')}
        >
          <Landmark className="h-8 w-8 text-blue-800" /> 
          <h1 className="text-xl font-semibold text-gray-900">E-Barangay</h1>
        </div>

        {/* Center Navigation */}
        <nav className="flex items-center space-x-8 text-sm font-medium text-gray-700">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="hover:text-blue-600"
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate('services')}
            className="hover:text-blue-600"
          >
            Requests
          </button>
          <button 
            onClick={() => onNavigate('facilities')}
            className="hover:text-blue-600"
          >
            Edit Directory
          </button>
        </nav>

        {/* Right Side Buttons */}
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline"> 
                <h1>Log in</h1>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-30" align="start">
              <DropdownMenuLabel>Sign in</DropdownMenuLabel>
              <DropdownMenuLabel>Log in</DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu> 
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem> View All Requests </DropdownMenuItem>
                <DropdownMenuItem> Settings </DropdownMenuItem>
                <DropdownMenuItem> Log Out </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>

  );
}