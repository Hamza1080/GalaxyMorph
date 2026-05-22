import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GalaxyMorph',
  description: 'Galaxy Morphology Classification using Deep Learning',
  generator: 'GalaxyMorph',
  icons: {
    icon: '/favicon.svg',
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
