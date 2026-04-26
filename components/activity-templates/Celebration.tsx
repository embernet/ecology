'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface CelebrationProps {
  trigger: boolean
}

const CELEBRATIONS = [
  // Classic confetti shower
  () => confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } }),

  // Fireworks from both sides
  () => {
    const launch = (x: number) =>
      confetti({ particleCount: 80, angle: x < 0.5 ? 60 : 120, spread: 55, origin: { x, y: 0.65 } })
    launch(0.1)
    setTimeout(() => launch(0.9), 150)
    setTimeout(() => launch(0.2), 350)
    setTimeout(() => launch(0.8), 500)
  },

  // Star explosion from centre
  () =>
    confetti({
      particleCount: 120,
      spread: 360,
      startVelocity: 30,
      gravity: 0.5,
      origin: { x: 0.5, y: 0.5 },
      shapes: ['star'],
      colors: ['#FFD700', '#FF6B35', '#7BC8F6', '#4CAF50', '#E91E63'],
    }),

  // Gentle drift from top
  () => {
    const end = Date.now() + 1200
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, gravity: 0.8 })
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, gravity: 0.8 })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  },
]

export default function Celebration({ trigger }: CelebrationProps) {
  useEffect(() => {
    if (!trigger) return
    const fn = CELEBRATIONS[Math.floor(Math.random() * CELEBRATIONS.length)]
    fn()
  }, [trigger])

  return null
}
