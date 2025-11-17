import { Menu, Landmark } from 'lucide-react';
import { Button } from "@/components/ui/button"
import axiosInstance from '@/lib/axios'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onNavigate: (view: 'dashboard' | 'directory' | 'requests') => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await axiosInstance.post('/auth/logout')
      router.refresh()
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }
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
            Dashboard
          </button>
          <button 
            onClick={() => onNavigate('directory')}
            className="hover:text-blue-600"
          >
            Directory
          </button>
          <button 
            onClick={() => onNavigate('requests')}
            className="hover:text-blue-600"
          >
            Requests
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
                <DropdownMenuItem onClick={handleSignOut}> Log Out </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>

  );
}