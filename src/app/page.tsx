'use client'

import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'

import Navbar from '@/components/layout/Navbar'
import GradientOrbs from '@/components/effects/GradientOrbs'
import Loader from '@/components/sections/Loader'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import Certifications from '@/components/sections/Certifications'
import Skills from '@/components/sections/Skills'
import Contact from '@/components/sections/Contact'
import { preloadLanyardAssets } from '@/lib/lanyardPreload'

const TiltedRibbon = dynamic(() => import('@/components/effects/TiltedRibbon'), { ssr: false })

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const [heroReady, setHeroReady] = useState(false)

  useEffect(() => {
    void preloadLanyardAssets()
  }, [])

  // Sync theme only when loaded becomes true to prevent light-theme flash during loader
  useEffect(() => {
    if (loaded) {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'light') {
        document.documentElement.classList.add('light')
      } else {
        document.documentElement.classList.remove('light')
        if (!savedTheme) {
          localStorage.setItem('theme', 'dark')
        }
      }
    } else {
      // Force dark mode (black background) during loading
      document.documentElement.classList.remove('light')
    }
  }, [loaded])

  const handleLoaderComplete = useCallback(() => {
    setLoaded(true)
  }, [])

  return (
    <main className="min-h-screen bg-black relative overflow-x-clip">
      <GradientOrbs />

      {/* Mount immediately (hidden) so Lanyard + GLB load during the loader */}
      <motion.div
        className="relative"
        initial={false}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{ pointerEvents: loaded ? 'auto' : 'none' }}
        aria-hidden={!loaded}
      >
        <Navbar />
        <Hero loaded={heroReady} />
        <TiltedRibbon />
        <About />
        <Projects />
        <Certifications />
        <Skills />
        <Contact />
      </motion.div>

      <AnimatePresence mode="wait" onExitComplete={() => setHeroReady(true)}>
        {!loaded && <Loader key="loader" onComplete={handleLoaderComplete} />}
      </AnimatePresence>
    </main>
  )
}
