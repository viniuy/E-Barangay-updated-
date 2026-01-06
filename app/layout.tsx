import type { Metadata } from 'next';
import '@/styles/global.css';
import { Toaster } from '@/components/ui/sonner';
import { NProgressConfig } from '@/components/NProgressConfig';

export const metadata: Metadata = {
  title: 'E-Barangay',
  description: 'Access all government services online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-background'>
        <NProgressConfig />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
