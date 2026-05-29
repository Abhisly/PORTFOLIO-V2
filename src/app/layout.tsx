import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { SpotlightCursor } from '@/components/ui/spotlight-cursor'
import ScrollProgress from '@/components/effects/ScrollProgress'
import SmoothScrollProvider from '@/components/layout/SmoothScrollProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Abhi Venkat Sai - Software Engineer & Full Stack Developer',
  description:
    'Building intelligent digital experiences with scalable systems, immersive UI, and AI-powered solutions. Full Stack Developer specializing in React, Next.js, TypeScript, Python, and AI.',
  keywords: [
    'Abhi Venkat Sai',
    'Software Engineer',
    'Full Stack Developer',
    'React Developer',
    'Next.js',
    'TypeScript',
    'AI Developer',
    'Portfolio',
  ],
  authors: [{ name: 'Abhi Venkat Sai' }],
  creator: 'Abhi Venkat Sai',
  openGraph: {
    title: 'Abhi Venkat Sai - Software Engineer & Full Stack Developer',
    description: 'Building intelligent digital experiences with scalable systems, immersive UI, and AI-powered solutions.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abhi Venkat Sai - Software Engineer & Full Stack Developer',
    description: 'Building intelligent digital experiences with scalable systems, immersive UI, and AI-powered solutions.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="preload" href="/card.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/parul-university-logo.png" as="image" />
        <link rel="preload" href="/lanyard-strap.png" as="image" />
      </head>
      <body className={`grain-overlay ${inter.className}`}>
        <SmoothScrollProvider>
          <SpotlightCursor />
          <ScrollProgress />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
