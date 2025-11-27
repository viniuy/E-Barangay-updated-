"use client"

import { useState } from "react"
import { FileCheck2, Volleyball, GraduationCap } from "lucide-react"
import { LoginForm } from '@/components/auth/LoginForm'
import { SignupForm } from '@/components/auth/SignupForm'

export default function GuestLanding() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-200 p-6 rounded-lg m-5">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-12 items-center p-8 md:p-12 max-w-6xl w-full bg-white shadow rounded-2xl">

        {/* Left Side */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Barangay Digital Portal.
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Request, apply, and schedule online — pick up when ready.
          </p>

          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => setLoginOpen(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Log In
            </button>

            <button
              onClick={() => setSignupOpen(true)}
              className="bg-white shadow px-5 py-3 rounded-lg font-medium text-gray-800 hover:shadow-md transition"
            >
              Sign Up →
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block h-full w-px bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(180deg,transparent,black_25%,black_75%,transparent)]"></div>

        {/* Right Side */}
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <FileCheck2 className="text-blue-800" />
            <div>
              <h3 className="font-semibold text-gray-900">Barangay Services</h3>
              <p className="text-gray-600 text-sm">
                Access certificates, assistance, and programs online — simple and fast.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Volleyball className="text-blue-800" />
            <div>
              <h3 className="font-semibold text-gray-900">Reserve Facilities</h3>
              <p className="text-gray-600 text-sm">
                Book barangay halls, sports courts, and other facilities quickly and hassle-free.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <GraduationCap className="text-blue-800" />
            <div>
              <h3 className="font-semibold text-gray-900">Carved by CvSU Computer Science Students</h3>
              <p className="text-gray-600 text-sm">
                A proudly built E-Barangay system bringing digital convenience to your community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginForm
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToSignup={() => {
          setLoginOpen(false)
          setSignupOpen(true)
        }}
      />

      {/* Signup Modal */}
      <SignupForm
        open={signupOpen}
        onOpenChange={setSignupOpen}
        onSwitchToLogin={() => {
          setSignupOpen(false)
          setLoginOpen(true)
        }}
      />
    </div>
  )
}