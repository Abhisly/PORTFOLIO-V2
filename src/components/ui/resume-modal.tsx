'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Download } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Prevent scrolling on the body when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex flex-col pointer-events-auto"
        >
          {/* Top Navigation Bar */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex items-center justify-between px-6 py-4 bg-transparent border-none absolute top-0 left-0 w-full z-50 pointer-events-none"
          >
            <div className="flex items-center gap-4 pointer-events-auto">
              <div className="flex items-center gap-2 text-white">
                <span className="font-mono text-sm tracking-widest uppercase text-white/60 drop-shadow-md hidden sm:inline">
                  Document Viewer
                </span>
                <span className="text-[#4ade80] drop-shadow-md hidden sm:inline">{"//"}</span>
                <span className="font-mono text-sm tracking-widest uppercase font-semibold drop-shadow-md">
                  Resume.pdf
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 pointer-events-auto">
              <a
                href="/ABHII%20RESUMEE.pdf"
                download="ABHII RESUMEE.pdf"
                className="btn-accent py-2 px-4 text-[0.65rem] !gap-2"
                data-cursor
              >
                <Download size={14} />
                <span>Download</span>
              </a>
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full shadow-lg"
                aria-label="Close modal"
                data-cursor
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>

          {/* PDF Viewer Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex-1 w-full h-full flex items-center justify-center overflow-hidden"
            onClick={onClose}
          >
            <div
              className="relative flex items-center justify-center shadow-2xl"
              style={{ height: '100%', maxWidth: '100%', aspectRatio: '8.5/11' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated Loading State */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-white/50 z-0 bg-black/20"
                  >
                    <div className="w-10 h-10 border-2 border-[#4ade80]/20 border-t-[#4ade80] rounded-full animate-spin mb-6" />
                    <span className="font-mono text-sm tracking-widest uppercase animate-pulse">Loading Document...</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <iframe
                src="/ABHII%20RESUMEE.pdf#view=Fit&toolbar=0&navpanes=0&scrollbar=0"
                className="w-full h-full border-none z-10 transition-opacity duration-700 ease-in-out"
                style={{ opacity: isLoading ? 0 : 1 }}
                onLoad={() => setIsLoading(false)}
                title="Resume PDF Viewer"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
