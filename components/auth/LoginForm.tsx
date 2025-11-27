'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { signIn } from '@/app/actions/auth'
import { toast } from 'sonner'

interface LoginFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToSignup: () => void
}

export function LoginForm({ open, onOpenChange, onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const result = await signIn(email, password)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Logged in successfully!')
        setEmail('')
        setPassword('')
        setShowLoadingScreen(true)

        const targetUrl = result.role === 'staff' ? '/admin' : '/'

        setTimeout(() => {
          window.location.href = targetUrl
        }, 1500)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {showLoadingScreen ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-lg font-medium">Logging you in...</p>
            <p className="text-sm text-gray-600">Please wait while we redirect you.</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Log In</DialogTitle>
              <DialogDescription>
                Enter your credentials to access your account
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Log In
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}