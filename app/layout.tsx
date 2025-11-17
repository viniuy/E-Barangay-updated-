import type { Metadata } from 'next'
import '@/styles/global.css'

export const metadata: Metadata = {
  title: 'E-Barangay',
  description: 'Access all government services online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        {children}
      </body>
    </html>
  )
}

