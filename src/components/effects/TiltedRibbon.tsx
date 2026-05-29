'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export default function TiltedRibbon() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { scrollY } = useScroll()

  const [vh, setVh] = useState(900)
  useEffect(() => {
    setVh(window.innerHeight)
    const handleResize = () => setVh(window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Drive the ribbon through Hero -> About, then wipe off
  // right after About's text reveal completes (≈82% through About).
  const heroRef = useRef<HTMLElement | null>(null)
  const aboutRef = useRef<HTMLElement | null>(null)
  const [heroEnd, setHeroEnd] = useState(900)

  useEffect(() => {
    heroRef.current = document.getElementById('hero') as HTMLElement | null
    aboutRef.current = document.getElementById('about') as HTMLElement | null

    const measure = () => {
      const heroEl = heroRef.current
      const aboutEl = aboutRef.current
      if (!heroEl || !aboutEl) return

      const heroTop = heroEl.getBoundingClientRect().top + window.scrollY

      setHeroEnd(heroTop + heroEl.offsetHeight)
    }

    measure()

    const ro = new ResizeObserver(() => measure())
    if (heroRef.current) ro.observe(heroRef.current)
    if (aboutRef.current) ro.observe(aboutRef.current)
    window.addEventListener('resize', measure)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // Ribbon behavior:
  // - sits near the bottom of Hero and slides into place
  // - stays during About's word reveal (ends at ~82%)
  // - then moves upward with scroll and fades out by the end of About
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ['start start', 'end end'],
  })

  const heroY = useTransform(scrollY, [0, heroEnd], [vh * 0.95, 0], { clamp: true })
  const afterTextY = useTransform(aboutProgress, [0, 0.82, 1], [0, 0, -900], { clamp: true })
  const y = useTransform([heroY, afterTextY], ([a, b]: number[]) => a + b)

  const opacity = useTransform(aboutProgress, [0, 0.82, 1], [1, 1, 0], { clamp: true })
  const x = useTransform(scrollY, [0, 8000], [0, -5000])

  if (!mounted) return null

  const ribbonText = Array.from({ length: 12 }, (_, index) => (
    <span key={index} className="inline-flex items-center gap-12 pr-12">
      <span className="text-white/80 font-semibold">FULL STACK DEVELOPER</span>
      <span className="text-[#4ade80] font-bold">|</span>
      <span className="text-white/45 font-normal">INTELLIGENT SYSTEMS</span>
      <span className="text-[#4ade80]/80 font-mono">{"//"}</span>
      <span className="text-white/80 font-semibold">AI & INTERACTIVE WEBGL</span>
      <span className="text-[#4ade80] font-bold">::</span>
    </span>
  ))

  return (
    <motion.div
      style={{
        rotate: -15,
        y,
        opacity,
      }}
      className="fixed top-0 left-[-20vw] w-[140vw] z-[5] pointer-events-none overflow-hidden select-none origin-center -translate-y-1/2"
    >
      <div className="relative w-full bg-gradient-to-r from-black/60 via-black/95 to-black/60 backdrop-blur-[14px] border-y border-[#4ade80]/30 py-9 md:py-12 shadow-2xl shadow-black/95">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_600px_at_50%_50%,rgba(74,222,128,0.12),transparent_65%)] opacity-45" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-36 bg-gradient-to-l from-black to-transparent" />
        <motion.div
          className="w-max flex font-mono text-xl md:text-3xl tracking-[0.34em] uppercase leading-none whitespace-nowrap drop-shadow-[0_10px_25px_rgba(0,0,0,0.75)]"
          style={{ x }}
        >
          <span className="flex items-center">{ribbonText}</span>
          <span className="flex items-center" aria-hidden="true">
            {ribbonText}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}
