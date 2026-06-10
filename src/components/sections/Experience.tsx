'use client'

import { motion } from 'framer-motion'
import { fadeUp, viewport } from '@/lib/animations'

export default function Experience() {
  return (
    <section id="experience" className="relative py-16 md:py-32 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Label */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="flex items-center gap-3 mb-14"
        >
          <div className="h-px w-8" style={{ background: 'var(--accent)' }} />
          <span className="label-accent">04 — Education</span>
        </motion.div>

        <motion.h2
          className="heading-lg text-white mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          My{' '}
          <span style={{ color: 'var(--accent)' }}>Journey</span>
        </motion.h2>

        {/* Timeline */}
        <div className="relative pl-8">
          {/* Vertical line */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-px"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={viewport}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'linear-gradient(to bottom, var(--accent), rgba(74,222,128,0.1))',
              transformOrigin: 'top',
            }}
          />

          {/* Item */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative pb-12"
          >
            {/* Dot */}
            <div
              className="absolute -left-[37px] top-6 timeline-dot"
            />

            {/* Card */}
            <div
              className="rounded-xl p-5 sm:p-7 border transition-all duration-300"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🎓</span>
                  <div>
                    <h3 className="text-white font-semibold text-base leading-snug mb-1">
                      B.Tech in Artificial Intelligence & Machine Learning
                    </h3>
                    <p className="label-mono">Parul University, Gujarat</p>
                  </div>
                </div>
                <span className="label-mono whitespace-nowrap">2022 – Present</span>
              </div>

              <p className="text-body text-sm mb-5">
                Pursuing a Bachelor of Technology specializing in AI & ML — covering machine learning, deep learning, data structures, and modern software engineering practices.
              </p>

              <div className="flex flex-wrap gap-2">
                {['Machine Learning', 'Deep Learning', 'DSA', 'Full Stack Development', 'AI Systems'].map((h) => (
                  <span key={h} className="tech-tag">{h}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
