"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { flushSync } from "react-dom"
import { Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

type AnimatedThemeTogglerProps = {
  className?: string
}

export const AnimatedThemeToggler = ({ className }: AnimatedThemeTogglerProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  // Default to dark mode (lightMode = false) initially to match server-side rendering
  const [lightMode, setLightMode] = useState(false)

  // On mount: sync theme state from document.documentElement and listen for changes
  useEffect(() => {
    setLightMode(document.documentElement.classList.contains("light"))

    const syncTheme = () =>
      setLightMode(document.documentElement.classList.contains("light"))

    const observer = new MutationObserver(syncTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  const onToggle = useCallback(async () => {
    if (!buttonRef.current) return

    // If View Transitions API is supported, use it for the cool circle effect
    if (document.startViewTransition) {
      await document.startViewTransition(() => {
        flushSync(() => {
          const toggled = !lightMode
          setLightMode(toggled)
          document.documentElement.classList.toggle("light", toggled)
          localStorage.setItem("theme", toggled ? "light" : "dark")
        })
      }).ready

      const { left, top, width, height } = buttonRef.current.getBoundingClientRect()
      const centerX = left + width / 2
      const centerY = top + height / 2
      const maxDistance = Math.hypot(
        Math.max(centerX, window.innerWidth - centerX),
        Math.max(centerY, window.innerHeight - centerY)
      )

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${centerX}px ${centerY}px)`,
            `circle(${maxDistance}px at ${centerX}px ${centerY}px)`,
          ],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    } else {
      // Fallback for browsers that don't support View Transitions
      const toggled = !lightMode
      setLightMode(toggled)
      document.documentElement.classList.toggle("light", toggled)
      localStorage.setItem("theme", toggled ? "light" : "dark")
    }
  }, [lightMode])

  return (
    <button
      ref={buttonRef}
      onClick={onToggle}
      aria-label="Switch theme"
      className={cn(
        "flex items-center justify-center p-2.5 rounded-full outline-none focus:outline-none active:outline-none focus:ring-0 cursor-pointer bg-white/5 hover:bg-white/10 transition-colors border border-white/10",
        className
      )}
      type="button"
    >
      <AnimatePresence mode="wait" initial={false}>
        {!lightMode ? (
          <motion.span
            key="sun-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: 25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
            className="text-white"
          >
            <Sun size={24} />
          </motion.span>
        ) : (
          <motion.span
            key="moon-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
            className="text-black"
          >
            <Moon size={24} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
