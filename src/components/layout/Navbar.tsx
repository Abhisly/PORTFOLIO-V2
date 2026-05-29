'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Credentials', href: '#certifications' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [atTop, setAtTop] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showResume, setShowResume] = useState(true)
  const [showTheme, setShowTheme] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setAtTop(scrollY < 24)

      const certsEl = document.getElementById('certifications')
      const contactEl = document.getElementById('contact')

      if (certsEl) {
        const rect = certsEl.getBoundingClientRect()
        const certsBottom = rect.bottom + scrollY
        setShowResume(scrollY < certsBottom)
      } else {
        setShowResume(true)
      }

      if (contactEl) {
        const rect = contactEl.getBoundingClientRect()
        const contactBottom = rect.bottom + scrollY
        setShowTheme(scrollY < contactBottom)
      } else {
        setShowTheme(true)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (href: string) => {
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const visible = atTop || menuOpen

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: visible ? 0 : -110, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-[10000] flex items-center justify-between bg-transparent border-0 shadow-none px-8 md:px-14 py-6 md:py-8 min-h-[4.5rem] md:min-h-[5.5rem] ${
          visible ? '' : 'pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <motion.span
            whileHover={{ scale: 1.05 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[0.95rem] md:text-[1.1rem] font-semibold tracking-[0.2em] uppercase text-white/40 cursor-pointer hover:text-white/70 transition-colors font-mono pointer-events-auto nav-logo"
            data-cursor
          >
            PORTFOLIO
          </motion.span>
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)' }}
          />
        </div>

        <div className="hidden md:flex items-center gap-8 pointer-events-auto">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="text-[0.9rem] md:text-[1.05rem] font-semibold tracking-[0.18em] uppercase text-white/35 hover:text-white transition-colors duration-200 font-mono nav-link"
              data-cursor
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Empty layout spacer to keep the links centered */}
        <div className="hidden md:block w-[180px]" />

        <button
          className="md:hidden flex flex-col gap-1.5 p-2 pointer-events-auto"
          onClick={() => setMenuOpen(!menuOpen)}
          data-cursor
          aria-label="Toggle menu"
        >
          <motion.span
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
            className="block w-5 h-px bg-white/60 origin-center nav-burger-line"
          />
          <motion.span animate={{ opacity: menuOpen ? 0 : 1 }} className="block w-5 h-px bg-white/60 nav-burger-line" />
          <motion.span
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
            className="block w-5 h-px bg-white/60 origin-center nav-burger-line"
          />
        </button>
      </motion.nav>

      {/* Floating Theme Toggler and Resume Link (Carried on Scroll) */}
      <div className="fixed top-6 md:top-8 right-8 md:right-14 z-[10001] hidden md:flex items-center gap-6 pointer-events-auto">
        <AnimatePresence>
          {showResume && (
            <motion.a
              key="floating-resume"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              href="/resume.pdf"
              download="Abhi_Venkat_Sai_Resume.pdf"
              className="text-[0.9rem] md:text-[1.05rem] font-semibold tracking-[0.18em] uppercase text-white/35 hover:text-white transition-colors duration-200 font-mono nav-resume"
              data-cursor
            >
              Resume
            </motion.a>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTheme && (
            <motion.div
              key="floating-theme"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatedThemeToggler />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#050505]/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-10"
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => scrollTo(link.href)}
                className="heading-lg text-white/80 hover:text-white transition-colors"
                data-cursor
              >
                {link.label}
              </motion.button>
            ))}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
              href="/resume.pdf"
              download
              className="btn-accent"
            >
              Download Resume
            </motion.a>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44 }}
            >
              <AnimatedThemeToggler />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
