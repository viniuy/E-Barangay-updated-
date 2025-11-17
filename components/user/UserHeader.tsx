'use client'

import { useState } from 'react'
import { Menu, Landmark, User } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { useAuth } from '@/lib/hooks/useAuth'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignupForm } from '@/components/auth/SignupForm'
import axiosInstance from '@/lib/axios'
import { useRouter } from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onNavigate: (view: 'dashboard' | 'services' | 'facilities' |  'application' | 'requests') => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await axiosInstance.post('/auth/logout')
      router.refresh()
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <>
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
            Services
          </button>
          <button 
            onClick={() => onNavigate('facilities')}
            className="hover:text-blue-600"
          >
            Facilities
          </button>
        </nav>

        {/* Right Side Buttons */}
        <div className="flex items-center space-x-3">
            {loading ? (
              <Button variant="outline" disabled>Loading...</Button>
            ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline"> 
                    <User className="h-4 w-4 mr-2" />
                    {user.email?.split('@')[0] || 'Account'}
              </Button>
            </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
              <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => onNavigate('requests')}>
                      View All Requests
                    </DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Log Out
                    </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setLoginOpen(true)}
                >
                  Log In
                </Button>
                <Button 
                  onClick={() => setSignupOpen(true)}
                >
                  Sign Up
                </Button>
              </>
            )}
        </div>
      </div>
    </div>

      <LoginForm 
        open={loginOpen} 
        onOpenChange={setLoginOpen}
        onSwitchToSignup={() => {
          setLoginOpen(false)
          setSignupOpen(true)
        }}
      />
      <SignupForm 
        open={signupOpen} 
        onOpenChange={setSignupOpen}
        onSwitchToLogin={() => {
          setSignupOpen(false)
          setLoginOpen(true)
        }}
      />
    </>
  );
}