'use client'

import { useRef } from 'react'
import { motion, MotionValue, useScroll, useTransform, useTime } from 'framer-motion'
import { fadeUp, viewport } from '@/lib/animations'
import LogoLoop from '@/components/ui/LogoLoop'
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiFramer,
  SiGreensock,
  SiHtml5,
  SiCss,
  SiPython,
  SiNodedotjs,
  SiFlask,
  SiSpringboot,
  SiMysql,
  SiMongodb,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiGithub,
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa'
import { VscVscode } from 'react-icons/vsc'

const rows = [
  {
    direction: 'left',
    items: [
      'Next.js',
      'React.js',
      'TypeScript',
      'JavaScript',
      'Tailwind CSS',
      'Framer Motion',
      'GSAP ScrollTrigger',
      'HTML5',
      'CSS3',
    ],
  },
  {
    direction: 'right',
    items: ['Python', 'Node.js', 'Flask', 'Java', 'Spring Boot', 'MySQL', 'MongoDB', 'REST APIs'],
  },
  {
    direction: 'left',
    items: [
      'Docker',
      'Kubernetes',
      'Git Versioning',
      'GitHub Ecosystem',
      'VS Code',
      'Prompt Engineering',
      'Machine Learning',
      'Algorithms & DSA',
    ],
  },
]

const techLogos = [
  { node: <SiNextdotjs />, title: 'Next.js', href: 'https://nextjs.org' },
  { node: <SiReact />, title: 'React', href: 'https://react.dev' },
  { node: <SiTypescript />, title: 'TypeScript', href: 'https://www.typescriptlang.org' },
  { node: <SiTailwindcss />, title: 'Tailwind CSS', href: 'https://tailwindcss.com' },
  { node: <SiJavascript />, title: 'JavaScript', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { node: <SiHtml5 />, title: 'HTML5', href: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
  { node: <SiCss />, title: 'CSS3', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
  { node: <SiNodedotjs />, title: 'Node.js', href: 'https://nodejs.org' },
  { node: <SiPython />, title: 'Python', href: 'https://www.python.org' },
  { node: <SiFlask />, title: 'Flask', href: 'https://flask.palletsprojects.com' },
  { node: <SiDocker />, title: 'Docker', href: 'https://www.docker.com' },
  { node: <SiKubernetes />, title: 'Kubernetes', href: 'https://kubernetes.io' },
  { node: <SiGit />, title: 'Git', href: 'https://git-scm.com' },
  { node: <SiGithub />, title: 'GitHub', href: 'https://github.com' },
  { node: <VscVscode />, title: 'VS Code', href: 'https://code.visualstudio.com' },
  { node: <FaJava />, title: 'Java', href: 'https://www.java.com' },
  { node: <SiSpringboot />, title: 'Spring Boot', href: 'https://spring.io/projects/spring-boot' },
  { node: <SiMysql />, title: 'MySQL', href: 'https://www.mysql.com' },
  { node: <SiMongodb />, title: 'MongoDB', href: 'https://www.mongodb.com' },
  { node: <SiGreensock />, title: 'GSAP', href: 'https://gsap.com' },
  { node: <SiFramer />, title: 'Framer Motion', href: 'https://www.framer.com/motion/' },
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-[clamp(4rem,8vw,8rem)] overflow-hidden bg-black border-y border-white/[0.04]"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          background:
            'radial-gradient(circle 760px at 50% 36%, rgba(74,222,128,0.045), transparent 64%), linear-gradient(to bottom, transparent, rgba(255,255,255,0.018), transparent)',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10 mb-12 sm:mb-16">
        <div className="text-center md:text-left">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="h-px w-8 bg-[#4ade80]" />
            <span className="label-accent">Tech Stack Inventory</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="heading-xl text-white tracking-normal"
          >
            Selected{' '}
            <em className="font-light text-white/42" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Technologies
            </em>
          </motion.h2>
        </div>
      </div>

      {/* Spacious row gaps using space-y-16 sm:space-y-20 */}
      <div
        className="relative w-full z-10 space-y-[clamp(2.5rem,5vw,5rem)] select-none"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 11%, black 89%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 11%, black 89%, transparent)',
        }}
      >
        {rows.map((row, rowIndex) => (
          <TechTicker key={rowIndex} {...row} rowIndex={rowIndex} scrollY={scrollY} />
        ))}

        <div className="pt-4">
          <LogoLoop
            logos={techLogos}
            speed={60}
            direction="left"
            logoHeight={42}
            gap={64}
            hoverSpeed={0}
            scaleOnHover
            ariaLabel="Technology Logo Loop"
          />
        </div>
      </div>
    </section>
  )
}

function TechTicker({
  items,
  direction,
  rowIndex,
  scrollY,
}: {
  items: string[]
  direction: string
  rowIndex: number
  scrollY: MotionValue<number>
}) {
  const triplicatedItems = [...items, ...items, ...items]
  const time = useTime()

  // Slower movement values:
  // Base speed: t * 0.0002% per millisecond (exceptionally slow background loop)
  // Scroll velocity speed: y * 0.0015% per pixel scrolled (extremely subtle and smooth parallax shift)
  const x = useTransform([time, scrollY], ([latestTime, latestScrollY]: number[]) => {
    const t = Number(latestTime)
    const y = Number(latestScrollY)

    const base = t * 0.0002
    const scrollEffect = y * 0.0015

    const totalOffset = (base + scrollEffect) % 33.333
    const directionMultiplier = direction === 'right' ? 1 : -1
    
    const percentage = -33.333 + (directionMultiplier * totalOffset)
    return `${percentage}%`
  })

  return (
    <div className="w-full overflow-hidden whitespace-nowrap">
      {/* Gap between elements is increased to gap-10 for breathing room */}
      <motion.div className="w-max flex gap-10 pr-10" style={{ x, willChange: 'transform' }}>
        {triplicatedItems.map((tech, idx) => (
          <TechPill key={`${tech}-${idx}`} name={tech} index={(idx % items.length) + 1} rowIndex={rowIndex} />
        ))}
      </motion.div>
    </div>
  )
}

function TechPill({ name, index, rowIndex }: { name: string; index: number; rowIndex: number }) {
  const formattedIndex = String(index + rowIndex * 10).padStart(2, '0')

  return (
    <div
      className="group relative inline-flex h-[clamp(4.5rem,8vw,7.5rem)] items-center gap-[clamp(1.5rem,3vw,2.5rem)] overflow-hidden rounded-full border border-white/[0.07] bg-white/[0.025] px-[clamp(2rem,5vw,4rem)] transition-all duration-300 hover:border-[#4ade80]/40 hover:bg-[#4ade80]/[0.045] hover:shadow-[0_0_32px_rgba(74,222,128,0.08)]"
      data-cursor
    >
      <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#4ade80]/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="font-mono text-[clamp(0.85rem,1.8vw,1.35rem)] text-white/28 transition-colors duration-300 group-hover:text-[#4ade80]/70">
        {formattedIndex}
      </span>
      <span className="h-[clamp(0.6rem,1.2vw,1.2rem)] w-[clamp(0.6rem,1.2vw,1.2rem)] rounded-full bg-[#4ade80]/60 transition-all duration-300 group-hover:scale-125 group-hover:bg-[#4ade80]" />
      <span className="font-mono text-[clamp(1.1rem,2.5vw,1.85rem)] font-semibold uppercase tracking-[0.15em] text-white/58 transition-colors duration-300 group-hover:text-white">
        {name}
      </span>
    </div>
  )
}
