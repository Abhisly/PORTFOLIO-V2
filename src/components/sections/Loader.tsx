'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { preloadLanyardAssets } from '@/lib/lanyardPreload'
import { CommitsGrid } from '@/components/ui/commits-grid'

interface LoaderProps {
  onComplete: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'done'>('loading')

  useEffect(() => {
    void preloadLanyardAssets()

    const startTime = Date.now()
    const duration = 4500

    const tick = () => {
      const elapsed = Date.now() - startTime
      const p = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(p)

      if (p < 100) {
        requestAnimationFrame(tick)
      } else {
        setPhase('done')
        setTimeout(onComplete, 200)
      }
    }

    requestAnimationFrame(tick)
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase === 'loading' ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black loader-bg"
        >
          {/* Glowing perimeter border tracking progress */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-50">
            <motion.rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="4"
              pathLength="100"
              strokeDasharray="100"
              animate={{ strokeDashoffset: 100 - progress }}
              transition={{ ease: 'linear', duration: 0.1 }}
              style={{ filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.7))' }}
            />
          </svg>

          <div className="relative flex flex-col items-center z-10">
            {/* The giant minimalist number */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden"
            >
              <span 
                className="font-bold tracking-tighter text-white"
                style={{ fontSize: 'clamp(6rem, 20vw, 15rem)', lineHeight: 0.85 }}
              >
                {progress}
              </span>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute bottom-12 text-[10px] tracking-[0.5em] text-white/40 uppercase font-mono"
          >
            Abhi Venkat Sai · Loading
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
