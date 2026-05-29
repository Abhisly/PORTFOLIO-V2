'use client'

import { motion } from 'framer-motion'
import { staggerContainer, wordReveal, viewport } from '@/lib/animations'

interface TextRevealProps {
  text: string
  className?: string
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  delay?: number
}

export default function TextReveal({
  text,
  className,
  tag: Tag = 'p',
  delay = 0,
}: TextRevealProps) {
  const words = text.split(' ')

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="overflow-hidden"
      style={{ transitionDelay: `${delay}s` }}
    >
      <Tag className={className}>
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
            <motion.span
              className="inline-block"
              variants={wordReveal}
              transition={{ delay: delay + i * 0.05 }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  )
}
