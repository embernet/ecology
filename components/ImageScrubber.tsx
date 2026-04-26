'use client'

import { useState } from 'react'

interface Props {
  images: string[]
  alt: string
  height?: string        // Tailwind height class, e.g. 'h-40'
  objectFit?: 'cover' | 'contain'
  className?: string
}

export default function ImageScrubber({
  images,
  alt,
  height = 'h-40',
  objectFit = 'cover',
  className,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) return null

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (images.length <= 1) return
    const rect = e.currentTarget.getBoundingClientRect()
    const index = Math.min(
      Math.floor(((e.clientX - rect.left) / rect.width) * images.length),
      images.length - 1
    )
    setActiveIndex(Math.max(0, index))
  }

  return (
    <div
      className={`${height} w-full bg-slate-100 relative overflow-hidden flex-shrink-0 ${className ?? ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setActiveIndex(0)}
    >
      <img
        src={images[activeIndex]}
        alt={alt}
        className={`absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105 ${
          objectFit === 'contain' ? 'object-contain p-2' : 'object-cover'
        }`}
      />
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10 pointer-events-none">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
