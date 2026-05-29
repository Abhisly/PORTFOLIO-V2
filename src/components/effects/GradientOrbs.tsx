'use client'

const ORBS = [
  { size: 500, x: '10%', y: '20%', color: 'rgba(74,222,128,0.035)', delay: '0s', duration: '14s' },
  { size: 350, x: '75%', y: '10%', color: 'rgba(74,222,128,0.025)', delay: '-4s', duration: '11s' },
  { size: 450, x: '60%', y: '70%', color: 'rgba(255,255,255,0.02)', delay: '-8s', duration: '17s' },
  { size: 300, x: '20%', y: '80%', color: 'rgba(74,222,128,0.02)', delay: '-2s', duration: '13s' },
]

export default function GradientOrbs() {
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            filter: 'blur(100px)',
            animation: `orbFloat ${orb.duration} ease-in-out infinite`,
            animationDelay: orb.delay,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  )
}
