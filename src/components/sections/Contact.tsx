'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { blurIn, fadeUp, viewport } from '@/lib/animations'

const EMAIL = 'Abhixsly.pro@gmail.com'

const socialLinks = [
  { label: 'Github', href: 'https://github.com/Abhisly' },
  { label: 'Linkedin', href: 'https://linkedin.com/in/abhi-venkat-sai' },
  { label: 'Leetcode', href: 'https://leetcode.com/u/9ZmqAzoUJT/' },
  { label: 'Portfolio', href: 'https://portfolio-nu-sage-28.vercel.app/' },
]

export default function Contact() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <section id="contact" className="contact-section" aria-label="Contact">
      <div className="contact-glow" aria-hidden="true" />


      <div className="contact-inner">
        <motion.header
          className="contact-hero"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.h2
            className="contact-title"
            variants={blurIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <span>LET&apos;S</span>
            <span>CREATE</span>
          </motion.h2>

          <div className="contact-availability">
            <span className="contact-availability-line" />
            <span className="label-mono contact-availability-text">
              Availability: {new Date().getFullYear()}_open_source
            </span>
          </div>
        </motion.header>

        <div className="contact-columns">
          <motion.div
            className="contact-col"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="label-mono contact-col-kicker">01 / direct_line</p>
            <a
              href={`mailto:${EMAIL}`}
              className="contact-email"
              data-cursor
            >
              {EMAIL}
            </a>
          </motion.div>

          <motion.div
            className="contact-col"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="label-mono contact-col-kicker">02 / neural_network</p>
            <ul className="contact-social-list">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-link"
                    data-cursor
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight size={18} strokeWidth={1.75} className="contact-social-arrow" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.footer
          className="contact-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="contact-footer-brand">
            <p className="label-mono contact-footer-role">design_development</p>
            <p className="contact-footer-name">ABHI VENKAT SAI</p>
          </div>

          <button
            type="button"
            onClick={scrollTop}
            className="label-mono contact-footer-top"
            data-cursor
          >
            back_to_top
            <span aria-hidden="true">↑</span>
          </button>

          <a
            href={`mailto:${EMAIL}?subject=Resume Request`}
            className="label-mono contact-footer-resume"
            data-cursor
          >
            <span>resume</span>
            <ArrowUpRight size={14} strokeWidth={2} />
          </a>
        </motion.footer>
      </div>
    </section>
  )
}
