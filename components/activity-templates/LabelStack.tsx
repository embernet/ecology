'use client'

import { useState } from 'react'

interface LabelStackProps {
  labels: string[]
  usedLabels: Set<string>
  onDragStart: (label: string) => void
  onReturnLabel: (label: string) => void
}

// Deterministic rotation from label text so it doesn't jump on re-render
function labelRotation(text: string): number {
  let hash = 0
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) & 0xffff
  return ((hash % 40) - 20) / 10  // -2.0 to +2.0 degrees
}

export default function LabelStack({ labels, usedLabels, onDragStart, onReturnLabel }: LabelStackProps) {
  const available = labels.filter((l) => !usedLabels.has(l))
  const [trayDragOver, setTrayDragOver] = useState(false)

  return (
    <div
      className={`label-stack${trayDragOver ? ' label-stack--drag-over' : ''}`}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setTrayDragOver(true) }}
      onDragLeave={() => setTrayDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setTrayDragOver(false)
        const label = e.dataTransfer.getData('text/plain')
        if (label) onReturnLabel(label)
      }}
    >
      <p className="label-stack__heading">Labels Tray</p>
      {available.length === 0 ? (
        <p className="label-stack__hint">All labels placed — drag one back here to change it</p>
      ) : (
        <div className="label-stack__labels">
          {available.map((label) => (
            <span
              key={label}
              className="label-chip"
              style={{ transform: `rotate(${labelRotation(label)}deg)` }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', label)
                e.dataTransfer.effectAllowed = 'move'
                onDragStart(label)
              }}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
