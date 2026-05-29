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
    title: 'AURA Intelligence',
    headline: ['AURA', 'Intelligence'],
    description:
      'AI-powered cybersecurity with real-time threat detection and phishing classification.',
    tags: ['Next.js', 'TypeScript', 'Ollama', 'AI/ML'],
    year: '2025',
    category: 'Cybersecurity',
    href: '#',
    metric: 'Threat detection under 100ms',
  },
  {
    title: 'Zero Waste Network',
    headline: ['Zero Waste', 'Network'],
    description:
      'Sustainability platform matching communities to redirect surplus food before it is wasted.',
    tags: ['React', 'Node.js', 'MongoDB', 'Maps API'],
    year: '2024',
    category: 'Full Stack',
    href: '#',
    metric: '10k+ meals redirected',
  },
  {
    title: 'AI Chatbot Assistant',
    headline: ['AI Chatbot', 'Assistant'],
    description:
      'Conversational AI with memory persistence, context-aware replies, and a glass UI shell.',
    tags: ['Python', 'Flask', 'React', 'NLP'],
    year: '2024',
    category: 'Artificial Intelligence',
    href: '#',
    metric: '50-turn context retention',
  },
  {
    title: 'Developer Portfolio',
    headline: ['Developer', 'Portfolio'],
    description:
      'Cinematic scroll storytelling, custom cursor, WebGL accents, and a dark premium system.',
    tags: ['Next.js', 'GSAP', 'Framer Motion', 'Three.js'],
    year: '2025',
    category: 'Design Engineering',
    href: '#',
    metric: 'Locked 60fps interactions',
  },
]

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [travelDistance, setTravelDistance] = useState(0)
  const [sectionHeight, setSectionHeight] = useState(4800)
  const [activeIndex, setActiveIndex] = useState(0)

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
  }, [])

  const displayIndex =
    activeIndex === 0
      ? '00'
      : activeIndex >= totalPanels - 1
        ? '—'
        : String(activeIndex).padStart(2, '0')

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
                      {project.href !== '#' ? (
                        <a href={project.href} className="hp-project-link label-mono" data-cursor>
                          <span>View project</span>
                          <ArrowUpRight size={15} strokeWidth={2} />
                        </a>
                      ) : (
                        <span className="hp-project-link is-muted label-mono">
                          <span>In archive</span>
                          <ArrowUpRight size={15} strokeWidth={2} />
                        </span>
                      )}
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
                href="https://github.com/"
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
