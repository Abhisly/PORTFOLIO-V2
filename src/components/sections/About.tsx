'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion'

function useIsLight() {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('light'))

    const obs = new MutationObserver(() =>
      setIsLight(document.documentElement.classList.contains('light'))
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return isLight
}

const aboutText = "Software Engineer with strong foundations in Data Structures & Algorithms and frontend development. Skilled in building scalable, responsive UIs using React.js, Next.js, TypeScript, and Tailwind CSS, with hands-on experience in full-stack development across Python, Node.js, and REST APIs. Demonstrates a consistent track record of delivering production-ready projects, contributing to open-source, and solving complex problems through clean, efficient code."

const techTerms = [
  'React.js',
  'Next.js',
  'TypeScript',
  'Tailwind',
  'CSS,',
  'Python,',
  'Node.js,',
  'REST',
  'APIs.',
  'Data',
  'Structures',
  'Algorithms',
  'full-stack',
  'open-source,',
  'Software',
  'Engineer'
]

function cleanWord(word: string) {
  return word.replace(/[.,\/#!$%\^\&\*;:{}=\-_`~()]/g, "")
}

export default function About() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  const progress = scrollYProgress
  const isLight = useIsLight()

  const words = aboutText.split(' ')
  const totalWords = words.length

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative h-auto md:h-[300vh] bg-black about-section"
    >
      {/* Desktop sticky scroll-reveal version */}
      <div className="hidden md:block sticky top-0 h-screen overflow-hidden bg-black about-sticky" style={{ height: '100dvh' }}>
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 py-10 md:py-14 gap-8 md:gap-10 relative z-10">
          <div className="w-[30%] pt-2 sm:pt-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#4ade80]" />
                <span className="font-mono text-xs tracking-widest uppercase text-white/60">Introduction</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight mt-2">
                About{' '}
                <em className="font-light text-white/40" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  Me
                </em>
              </h2>
            </motion.div>
          </div>

          <div className="w-full md:w-[65%] flex flex-col justify-center">
            <p className="font-sans font-normal text-xl md:text-2xl lg:text-3xl leading-[1.4] text-white tracking-tight flex flex-wrap gap-x-3 gap-y-2">
              {words.map((word, index) => {
                const start = (index / totalWords) * 0.82
                const end = ((index + 1.4) / totalWords) * 0.82

                const isTech = techTerms.some(term => cleanWord(word).toLowerCase() === cleanWord(term).toLowerCase())

                return (
                  <WordRevealSpan
                    key={index}
                    word={word}
                    start={start}
                    end={end}
                    progress={progress}
                    isTech={isTech}
                    isLight={isLight}
                  />
                )
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile static text version */}
      <div className="block md:hidden py-16 px-6 sm:px-10 relative z-10 bg-black">
        <div className="max-w-[650px] mx-auto flex flex-col items-start gap-8">
          <div>
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#4ade80]" />
              <span className="font-mono text-xs tracking-widest uppercase text-white/60">Introduction</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight mt-2">
              About{' '}
              <em className="font-light text-white/40" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Me
              </em>
            </h2>
          </div>

          <p className="font-sans font-normal text-xl sm:text-2xl leading-[1.4] text-white tracking-tight flex flex-wrap gap-x-3 gap-y-2 text-left">
            {words.map((word, index) => {
              const isTech = techTerms.some(term => cleanWord(word).toLowerCase() === cleanWord(term).toLowerCase())
              return (
                <span
                  key={index}
                  className="inline-block"
                  style={{
                    color: isTech ? '#4ade80' : '#ffffff',
                    textShadow: isTech ? '0 0 12px rgba(74,222,128,0.3)' : 'none'
                  }}
                >
                  {word}
                </span>
              )
            })}
          </p>
        </div>
      </div>
    </section>
  )
}

function WordRevealSpan({
  word,
  start,
  end,
  progress,
  isTech,
  isLight,
}: {
  word: string
  start: number
  end: number
  progress: MotionValue<number>
  isTech: boolean
  isLight: boolean
}) {
  const hiddenColor = isLight ? 'rgba(5,5,5,0)' : 'rgba(255,255,255,0)'
  const normalColor = isLight ? '#1a1a1a' : '#ffffff'

  const opacity = useTransform(progress, [start, end], [0, 1])
  const color = useTransform(
    progress,
    [start, end],
    [hiddenColor, isTech ? '#4ade80' : normalColor]
  )
  const textShadow = useTransform(
    progress,
    [start, end],
    ['0 0 0px rgba(74,222,128,0)', isTech ? '0 0 12px rgba(74,222,128,0.45)' : '0 0 0px rgba(0,0,0,0)']
  )

  return (
    <motion.span
      style={{
        opacity,
        color,
        textShadow,
        willChange: 'opacity, color, text-shadow',
      }}
      className="inline-block"
    >
      {word}
    </motion.span>
  )
}
