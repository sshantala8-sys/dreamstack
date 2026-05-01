import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DreamStack — Build. Learn. Get Hired.',
  description: 'AI-powered project marketplace and talent incubator for students.',
  keywords: ['student projects', 'team collaboration', 'AI project management'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
