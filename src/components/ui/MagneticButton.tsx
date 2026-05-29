'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  download?: boolean | string
  target?: string
  rel?: string
}

export default function MagneticButton({
  children,
  className,
  onClick,
  href,
  variant = 'secondary',
  download,
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPosition({ x: x * 0.35, y: y * 0.35 })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const baseClass = cn(
    'relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-sm tracking-wide transition-all duration-300 overflow-hidden glow-btn',
    {
      'bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.2)]':
        variant === 'primary',
      'border border-white/20 text-white/90 hover:border-white/40 hover:bg-white/5 backdrop-blur-sm':
        variant === 'secondary',
      'text-white/60 hover:text-white': variant === 'ghost',
    },
    className
  )

  const content = (
    <motion.div
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 20, mass: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full"
    >
      <span className={baseClass}>{children}</span>
    </motion.div>
  )

  if (href) {
    return (
      <a
        href={href}
        download={download}
        target={target}
        rel={rel}
        className="inline-block"
        data-cursor-hover
      >
        {content}
      </a>
    )
  }

  return (
    <button onClick={onClick} className="inline-block" data-cursor-hover>
      {content}
    </button>
  )
}
