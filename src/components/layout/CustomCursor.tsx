'use client'

import { useEffect, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function CustomCursor() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const cursorRingRef = useRef<HTMLDivElement>(null)

  const springConfig = { damping: 30, stiffness: 400, mass: 0.4 }
  const ringConfig = { damping: 22, stiffness: 180, mass: 0.7 }

  const dotX = useSpring(mouseX, springConfig)
  const dotY = useSpring(mouseY, springConfig)
  const ringX = useSpring(mouseX, ringConfig)
  const ringY = useSpring(mouseY, ringConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const onEnter = () => cursorRingRef.current?.classList.add('hovering')
    const onLeave = () => cursorRingRef.current?.classList.remove('hovering')

    window.addEventListener('mousemove', moveCursor, { passive: true })

    const targets = document.querySelectorAll('a, button, [data-cursor]')
    targets.forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    const observer = new MutationObserver(() => {
      const newTargets = document.querySelectorAll('a, button, [data-cursor]')
      newTargets.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      observer.disconnect()
    }
  }, [mouseX, mouseY])

  return (
    <>
      <motion.div className="cursor-dot" style={{ x: dotX, y: dotY }} />
      <motion.div ref={cursorRingRef} className="cursor-ring" style={{ x: ringX, y: ringY }} />
    </>
  )
}
