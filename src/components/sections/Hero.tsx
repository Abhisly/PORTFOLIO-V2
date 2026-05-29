'use client'

import { motion } from 'framer-motion'
import Lanyard from '@/components/ui/Lanyard'

export default function Hero({ loaded = true }: { loaded?: boolean }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-visible bg-black"
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle 720px at 50% 50%, rgba(74,222,128,0.055), transparent 68%), linear-gradient(to bottom, rgba(255,255,255,0.025), transparent 28%)',
        }}
      />

      {/* Text content — rendered FIRST so it's below lanyard in stacking order */}
      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col lg:flex-row justify-center lg:items-center gap-10 pointer-events-none">
        <div className="w-full lg:w-[50%] flex flex-col justify-center items-start z-10 pointer-events-auto">
          <div className="w-full text-left mb-7 select-none">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="label-mono text-white/40"
            >
              Full Stack Developer
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: loaded ? 0.15 : 0 }}
              className="mt-4 leading-[0.92] font-black uppercase font-sans tracking-[-0.05em] text-white"
            >
              <span className="block text-[16vw] sm:text-[11.5vw] lg:text-[6.3vw] xl:text-[5.9vw]">
                Abhi
              </span>
              <span className="block text-[16vw] sm:text-[11.5vw] lg:text-[6.3vw] xl:text-[5.9vw] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#c7f9d6] to-[#4ade80] name-gradient">
                Venkat Sai
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: loaded ? 0.4 : 0, duration: 0.8 }}
            className="text-white/45 label-mono text-xs md:text-sm uppercase text-left"
          >
            Software Engineer &amp; Full Stack Architect
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={loaded ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
            transition={{ delay: loaded ? 0.6 : 0, duration: 0.8, ease: 'easeOut' }}
            className="mt-6 w-full max-w-[520px] origin-left"
          >
            <div className="h-px w-24 bg-[#4ade80]/70 shadow-[0_0_18px_rgba(74,222,128,0.25)]" />
          </motion.div>
        </div>

        <div className="hidden lg:block lg:w-[50%] min-h-[1px] pointer-events-none" aria-hidden />
      </div>

      {/* Lanyard — rendered LAST in DOM so it composites above ALL other elements */}
      <div className="lanyard-hero-slot hidden md:block">
        <Lanyard
          position={[0, 0, 20]}
          gravity={[0, -40, 0]}
          fov={20}
          transparent
        />
      </div>
    </section>
  )
}
