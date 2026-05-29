'use client'

interface MarqueeTextProps {
  texts: string[]
  reverse?: boolean
  speed?: number
  className?: string
}

export default function MarqueeText({ texts, reverse = false, speed = 28, className }: MarqueeTextProps) {
  const allTexts = [...texts, ...texts]

  return (
    <div className="marquee-outer overflow-hidden w-full">
      <div
        className={`marquee-track ${reverse ? 'reverse' : ''} ${className || ''}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {allTexts.map((text, i) => (
          <span key={i} className={`marquee-text ${i % 3 === 2 ? 'dimmer' : ''}`}>
            {text}
            <span style={{ marginRight: '2rem', color: 'transparent', WebkitTextStroke: 'inherit' }}> / </span>
          </span>
        ))}
      </div>
    </div>
  )
}
