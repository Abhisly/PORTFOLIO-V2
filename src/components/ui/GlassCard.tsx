'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { scaleIn, viewport } from '@/lib/animations'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
  hover?: boolean
  delay?: number
}

export default function GlassCard({
  children,
  className,
  animate = false,
  hover = true,
  delay = 0,
}: GlassCardProps) {
  const classes = cn(
    'glass rounded-2xl p-6',
    hover && 'glass-hover',
    className
  )

  if (animate) {
    return (
      <motion.div
        className={classes}
        variants={scaleIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    )
  }

  return <div className={classes}>{children}</div>
}
