'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const projects = [
  {
    title: 'URL SYSTEM',
    headline: ['URL', 'SYSTEM'],
    description:
      'AI-powered cybersecurity platform for phishing URL, fake email, and scam detection with real-time threat scoring.',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'Ollama', 'Llama 3', 'OCR', 'Tailwind CSS'],
    year: '2025',
    category: 'Cybersecurity',
    github: 'https://github.com/Abhisly/URL-SYSTEM',
    live: 'https://url-system.vercel.app/',
    metric: 'Threat detection under 100ms',
    mockup: '/mockup-aura.png',
  },
  {
    title: 'ZeroWaste',
    headline: ['Zero', 'Waste'],
    description:
      'Smart food wastage protection & redistribution system connecting restaurants, NGOs, and delivery agents with real-time donation workflows.',
    tags: ['React.js', 'Next.js', 'Node.js', 'MongoDB', 'MySQL', 'Tailwind CSS'],
    year: '2026',
    category: 'Full Stack',
    github: 'https://github.com/Abhisly/ZeroWaste',
    live: 'https://zero-waste-puce.vercel.app/',
    metric: 'Real-time routing & workflows',
    mockup: '/mockup-zerowaste.png',
  },
  {
    title: 'AURA',
    headline: ['AURA', 'Platform'],
    description:
      'Adaptive AI skill intelligence platform offering domain-specific MCQ assessments, learning roadmaps, and an AI mentor module.',
    tags: ['React.js', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    year: '2025',
    category: 'Artificial Intelligence',
    github: 'https://github.com/Abhisly/AURA',
    live: 'https://aura-five-omega.vercel.app/',
    metric: 'Immersive 3D animated UI',
    mockup: '/mockup-aura.png',
  },
  {
    title: 'Developer Portfolio',
    headline: ['Developer', 'Portfolio'],
    description:
      'Premium developer portfolio featuring immersive UI, smooth scroll-based animations, and cinematic transitions.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GSAP', 'Three.js', 'Lenis'],
    year: '2026',
    category: 'Design Engineering',
    github: 'https://github.com/Abhisly/PORTFOLIO-V2/',
    live: 'https://portfolio-v2-eight-livid.vercel.app/',
    metric: 'Locked 60fps interactions',
    mockup: '/mockup-portfolio.png',
  },
]

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [travelDistance, setTravelDistance] = useState(0)
  const [sectionHeight, setSectionHeight] = useState(4800)
  const [activeIndex, setActiveIndex] = useState(0)

  const [isMobile, setIsMobile] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], [0, -travelDistance], { clamp: true })
  const progressScale = useTransform(scrollYProgress, [0.02, 0.98], [0, 1], { clamp: true })

  const totalPanels = useMemo(() => projects.length + 2, [])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.round(v * (totalPanels - 1))
    setActiveIndex(Math.min(totalPanels - 1, Math.max(0, idx)))
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const measure = () => {
      if (!trackRef.current) return
      const distance = Math.max(0, trackRef.current.scrollWidth - window.innerWidth)
      setTravelDistance(distance)
      setSectionHeight(Math.max(window.innerHeight * 3.8, distance + window.innerHeight * 1.35))
    }

    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [isMobile])

  // Refresh GSAP ScrollTrigger when Projects height changes to prevent subsequent sections from pinning early
  useEffect(() => {
    if (isMobile) return

    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          ScrollTrigger.refresh()
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [sectionHeight, isMobile])

  const displayIndex =
    activeIndex === 0
      ? '00'
      : activeIndex >= totalPanels - 1
        ? '—'
        : String(activeIndex).padStart(2, '0')

  if (isMobile) {
    return <MobileProjects />
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="hp-section"
      style={{ height: sectionHeight }}
      aria-label="Projects"
    >
      <div className="hp-sticky">
        <div className="hp-hud" aria-hidden="true">
          <div className="hp-hud-top">
            <span className="label-mono text-white/35">Work</span>
            <span className="hp-hud-divider" />
            <span className="label-mono text-[#4ade80]">{displayIndex}</span>
            <span className="label-mono text-white/25">/ {String(projects.length).padStart(2, '0')}</span>
          </div>
          <div className="hp-hud-scroll label-mono">
            <span>Scroll</span>
            <span className="hp-hud-arrow">→</span>
          </div>
        </div>

        <motion.div className="hp-progress" style={{ scaleX: progressScale }} />

        <motion.div ref={trackRef} className="hp-track" style={{ x }}>
          <ScrollPanel>
            <div className="hp-panel hp-panel--intro">
              <p className="label-mono text-white/40 mb-6">Selected work</p>
              <h2 className="hp-intro-title">
                <span>Featured</span>
                <span className="hp-intro-title-accent">Projects</span>
              </h2>
              <p className="hp-intro-copy">
                Vertical scroll drives horizontal motion. One system per frame — no grids, no cards.
              </p>
              <div className="hp-intro-rule" />
              <p className="label-mono text-white/30 text-xs tracking-[0.28em] uppercase">
                {projects.length} builds · {new Date().getFullYear()}
              </p>
            </div>
          </ScrollPanel>

          {projects.map((project, i) => (
            <ScrollPanel key={project.title}>
              <article className="hp-panel hp-panel--project" data-cursor>
                <div className="hp-project-layout">
                  <span className="hp-watermark" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="hp-project-content">
                    <h3 className="hp-project-title">
                      <span className="hp-project-title-a">{project.headline[0]}</span>
                      <span className="hp-project-title-b">{project.headline[1]}</span>
                    </h3>

                    <p className="hp-project-desc">{project.description}</p>

                    <dl className="hp-project-specs">
                      <div>
                        <dt>Year</dt>
                        <dd>{project.year}</dd>
                      </div>
                      <div>
                        <dt>Category</dt>
                        <dd>{project.category}</dd>
                      </div>
                      <div>
                        <dt>Signal</dt>
                        <dd className="hp-spec-accent">{project.metric}</dd>
                      </div>
                    </dl>

                    <footer className="hp-project-foot">
                      <p className="hp-project-stack label-mono">{project.tags.join(' · ')}</p>
                      <div className="hp-project-links">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hp-project-link label-mono"
                            data-cursor
                          >
                            <span>GitHub</span>
                            <ArrowUpRight size={18} strokeWidth={2} />
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hp-project-link label-mono"
                            data-cursor
                          >
                            <span>Live Site</span>
                            <ArrowUpRight size={18} strokeWidth={2} />
                          </a>
                        )}
                      </div>
                    </footer>
                  </div>
                </div>
              </article>
            </ScrollPanel>
          ))}

          <ScrollPanel>
            <div className="hp-panel hp-panel--outro">
              <p className="label-mono text-white/30 mb-8">Archive end</p>
              <p className="hp-outro-line">More experiments live on GitHub.</p>
              <a
                href="https://github.com/Abhisly"
                target="_blank"
                rel="noopener noreferrer"
                className="hp-outro-link label-mono"
                data-cursor
              >
                <span>Open GitHub</span>
                <ArrowUpRight size={16} strokeWidth={2} />
              </a>
            </div>
          </ScrollPanel>
        </motion.div>
      </div>
    </section>
  )
}

function ScrollPanel({ children }: { children: React.ReactNode }) {
  return <div className="hp-frame">{children}</div>
}

/* ─────────────────────────────────────────────
   MOBILE — editorial full-bleed panels (no card boxes)
   ───────────────────────────────────────────── */
function MobileProjects() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const slides = Array.from(container.querySelectorAll('[data-slide]'))
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.slide)
            if (!isNaN(idx)) setActiveIdx(idx)
          }
        })
      },
      { root: container, threshold: 0.55 }
    )
    slides.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="projects-mobile" className="bg-black relative z-10 border-t border-white/[0.05] overflow-hidden">

      {/* Header */}
      <div className="pt-14 px-6 pb-2">
        <p className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-[#4ade80]/70 mb-5">
          Selected Work
        </p>
        <h2 className="hp-intro-title leading-none mb-3">
          <span>Featured</span>
          <span className="hp-intro-title-accent">Projects</span>
        </h2>
        {/* progress strip + count */}
        <div className="flex items-center gap-4 mt-6">
          <div className="flex items-center gap-1.5">
            {projects.map((_, i) => (
              <motion.span
                key={i}
                animate={{
                  width: activeIdx === i ? 24 : 4,
                  opacity: activeIdx === i ? 1 : 0.3,
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="block h-[3px] rounded-full bg-[#4ade80]"
                style={{ display: 'block' }}
              />
            ))}
          </div>
          <span className="font-mono text-[0.6rem] tracking-widest text-white/30 uppercase">
            {String(activeIdx + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Horizontal snap strip — NO cards, full-bleed editorial panels */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {projects.map((project, i) => (
          <article
            key={project.title}
            data-slide={i}
            className="snap-center flex-shrink-0 relative"
            style={{ width: '100vw', minHeight: 520 }}
          >
            {/* Ghost index — full bleed background watermark */}
            <span
              aria-hidden="true"
              className="absolute right-0 top-0 select-none pointer-events-none font-black leading-none"
              style={{
                fontSize: 'clamp(9rem, 42vw, 16rem)',
                color: 'transparent',
                WebkitTextStroke: '1px rgba(74,222,128,0.07)',
                letterSpacing: '-0.06em',
                lineHeight: 0.85,
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            <div className="relative z-10 px-6 pt-10 pb-8 flex flex-col" style={{ minHeight: 520 }}>

              {/* Top meta row */}
              <div className="flex items-center gap-3 mb-7">
                <span
                  className="font-mono text-[0.58rem] tracking-[0.25em] uppercase text-[#4ade80]"
                >
                  {project.category}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="font-mono text-[0.58rem] tracking-widest text-white/30 uppercase">
                  {project.year}
                </span>
              </div>

              {/* Title — editorial, large */}
              <h3
                className="flex flex-col leading-[0.88] mb-6"
                style={{
                  fontSize: 'clamp(3rem, 15vw, 5.5rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.055em',
                }}
              >
                <span className="text-white">{project.headline[0]}</span>
                <span
                  style={{
                    color: 'rgba(74,222,128,0.92)',
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic',
                    fontWeight: 300,
                  }}
                >
                  {project.headline[1]}
                </span>
              </h3>

              {/* Hairline separator */}
              <div className="w-12 h-px bg-[#4ade80]/40 mb-5" />

              {/* Description */}
              <p className="text-white/60 text-[0.92rem] leading-[1.7] font-light mb-6 max-w-[38ch]">
                {project.description}
              </p>

              {/* Metric signal — inline, text-only style */}
              <div className="flex items-center gap-2.5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shrink-0 animate-pulse" />
                <span className="font-mono text-[0.62rem] tracking-[0.22em] uppercase text-[#4ade80]">
                  {project.metric}
                </span>
              </div>

              {/* Spacer pushes footer down */}
              <div className="flex-1" />

              {/* Footer — full-width top border, stack + links inline */}
              <div
                className="pt-5 mt-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="font-mono text-[0.58rem] tracking-[0.14em] uppercase text-white/35 leading-loose mb-4">
                  {project.tags.join(' · ')}
                </p>
                <div className="flex items-center gap-6">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] tracking-widest uppercase text-white/50 hover:text-[#4ade80] transition-colors duration-200"
                    >
                      GitHub <ArrowUpRight size={13} strokeWidth={2} />
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] tracking-widest uppercase text-white/50 hover:text-[#4ade80] transition-colors duration-200"
                    >
                      Live Site <ArrowUpRight size={13} strokeWidth={2} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="px-6 pt-6 pb-14" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p className="text-white/30 text-sm font-light mb-4">More experiments on GitHub.</p>
        <a
          href="https://github.com/Abhisly"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.22em] uppercase text-[#4ade80]/60 hover:text-[#4ade80] pb-1 transition-all"
          style={{ borderBottom: '1px solid rgba(74,222,128,0.3)' }}
        >
          Open GitHub <ArrowUpRight size={13} strokeWidth={2} />
        </a>
      </div>
    </section>
  )
}
