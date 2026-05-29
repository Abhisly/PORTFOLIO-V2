'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Award } from 'lucide-react'
import { RadialScrollGallery } from '@/components/ui/portfolio-and-image-gallery'
import { fadeUp, viewport } from '@/lib/animations'

const certifications = [
  {
    title: 'Meta Full Stack Developer',
    issuer: 'Meta',
    image: '/certifications/META FULLSTACK.png',
  },
  {
    title: 'Meta Backend Developer',
    issuer: 'Meta',
    image: '/certifications/META-BACKEND DEVELOPER.png',
  },
  {
    title: 'Google Cloud AI',
    issuer: 'Google Cloud',
    image: '/certifications/GOOGLE CLOUD AI.png',
  },
  {
    title: 'Generative AI',
    issuer: 'Oracle / SkillUp',
    image: '/certifications/SKILL UP-GENARATIVE AI.png',
  },
  {
    title: 'Prompt Engineering',
    issuer: 'SkillUp',
    image: '/certifications/SKILL UP-PROMPT ENGINEERING.png',
  },
  {
    title: 'Python from Zero-to-Hero',
    issuer: 'Udemy',
    image: '/certifications/UDEMY-PYTHON.png',
  },
  {
    title: 'DSA Workshop',
    issuer: 'Parul University',
    image: '/certifications/DSA WORKSHOP.png',
  },
  {
    title: 'Vadodara Hackathon',
    issuer: 'Vadodara Hackathon',
    image: '/certifications/VADODARA HACKATHON .png',
  },
]

export default function Certifications() {
  const [selectedCertIndex, setSelectedCertIndex] = useState<number | null>(null)
  // Index 6 is at the top of the wheel (270 degrees) at rotation 0
  const [activeIndex, setActiveIndex] = useState<number>(6)

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setSelectedCertIndex((prev) =>
      prev === null ? null : prev === 0 ? certifications.length - 1 : prev - 1
    )
  }

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setSelectedCertIndex((prev) =>
      prev === null ? null : prev === certifications.length - 1 ? 0 : prev + 1
    )
  }

  // Keyboard navigation
  useEffect(() => {
    if (selectedCertIndex === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCertIndex(null)
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCertIndex])

  // Keep active index in sync with expanded modal selection
  useEffect(() => {
    if (selectedCertIndex !== null) {
      setActiveIndex(selectedCertIndex)
    }
  }, [selectedCertIndex])

  // Pinned section header rendered inside the GSAP scroll-pinning layout
  const sectionHeader = (
    <div className="max-w-7xl mx-auto px-6 text-center w-full mb-2 sm:mb-4">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="inline-flex items-center gap-3 mb-2 sm:mb-3"
      >
        <div className="h-px w-8 bg-[#4ade80]" />
        <span className="label-accent">03 — Credentials</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="heading-xl text-white tracking-normal"
      >
        Selected{' '}
        <em
          className="font-light text-white/50"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Achievements
        </em>
      </motion.h2>
    </div>
  )

  // Pinned section footer metadata panel showing active item title & details
  const sectionFooterMetadata = (
    <div className="max-w-2xl mx-auto text-center h-28 flex flex-col justify-center px-4 relative z-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <span className="text-xs sm:text-sm font-mono tracking-widest text-[#4ade80] uppercase mb-2">
            {certifications[activeIndex].issuer}
          </span>
          <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-wide leading-tight">
            {certifications[activeIndex].title}
          </h3>
          <span className="text-[10px] sm:text-xs text-white/40 mt-3 font-mono uppercase tracking-widest">
            [ Click card to expand ]
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  )

  return (
    <section
      id="certifications"
      className="relative overflow-hidden bg-black border-y border-white/[0.04]"
    >
      {/* Background radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(circle 800px at 50% 50%, rgba(74,222,128,0.035), transparent 70%)',
        }}
      />

      <RadialScrollGallery
        header={sectionHeader}
        footer={sectionFooterMetadata}
        baseRadius={580}
        mobileRadius={260}
        scrollDuration={4500}
        visiblePercentage={40}
        startTrigger="top top"
        onItemSelect={(index) => setSelectedCertIndex(index)}
        onActiveIndexChange={setActiveIndex}
        className="relative z-10 !min-h-0"
      >
        {() =>
          certifications.map((cert, index) => {
            return (
              <div
                key={index}
                className="w-[190px] aspect-[7/5] sm:w-[350px] rounded-xl border border-white/[0.06] shadow-sm overflow-hidden group relative hover:border-[#4ade80]/40 hover:shadow-[0_0_30px_rgba(74,222,128,0.12)] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
                data-cursor
              >
                {/* Full Card Image Container */}
                <div className="w-full h-full relative overflow-hidden bg-black/50">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-cover transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
                    draggable="false"
                  />

                  {/* Centered Hover Overlay - Badge Only */}
                  <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center
                      opacity-0 group-hover:opacity-100 transition-opacity duration-700 cubic-bezier(0.16, 1, 0.3, 1) select-none pointer-events-none"
                  >
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-mono border border-white/20 backdrop-blur-md">
                      <Award size={10} />
                      View Certificate
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </RadialScrollGallery>

      {/* Lightbox / Expanded Modal View */}
      <AnimatePresence>
        {selectedCertIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setSelectedCertIndex(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedCertIndex(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all z-[100000] flex items-center justify-center"
              aria-label="Close modal"
              data-cursor
            >
              <X size={20} />
            </button>

            {/* Modal content wrapper */}
            <div
              className="relative max-w-4xl w-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent close on clicking content
            >
              {/* Navigation arrows inside layout */}
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:-left-20 p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white transition-all z-10 flex items-center justify-center"
                data-cursor
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 sm:-right-20 p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white transition-all z-10 flex items-center justify-center"
                data-cursor
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>

              {/* Certificate Image Frame */}
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full bg-[#080808] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-2 sm:p-3"
              >
                <div className="relative aspect-[16/11] w-full flex items-center justify-center bg-black rounded-lg overflow-hidden">
                  <img
                    src={certifications[selectedCertIndex].image}
                    alt={certifications[selectedCertIndex].title}
                    className="max-w-full max-h-[65vh] sm:max-h-[70vh] object-contain"
                  />
                </div>

                {/* Details Footer */}
                <div className="px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-white/[0.05] mt-2">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#4ade80] uppercase">
                      {certifications[selectedCertIndex].issuer}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      {certifications[selectedCertIndex].title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#4ade80]/10 text-[#4ade80] text-[10px] font-mono border border-[#4ade80]/20 flex items-center gap-1.5">
                      <Award size={12} />
                      Verified Credential
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
