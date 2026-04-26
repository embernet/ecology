'use client'

import { useState } from 'react'

interface DropZoneProps {
  zoneId: string
  type: 'name' | 'description'
  value: string | null
  correct: string
  showAnswer?: boolean
  onDrop: (zoneId: string, label: string) => void
  onReturnLabel: (label: string) => void
}

export default function DropZone({
  zoneId,
  type,
  value,
  correct,
  showAnswer = false,
  onDrop,
  onReturnLabel,
}: DropZoneProps) {
  const [dragOver, setDragOver] = useState(false)

  // In answers mode the zone always displays the correct answer, so style against that.
  const displayValue = showAnswer ? correct : value
  const isCorrect = displayValue === correct
  const isEmpty = !displayValue

  const classes = [
    'drop-zone',
    `drop-zone--${type}`,
    dragOver && 'drop-zone--drag-over',
    displayValue && isCorrect && 'drop-zone--correct',
    displayValue && !isCorrect && 'drop-zone--incorrect',
    isEmpty && 'drop-zone--empty',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      draggable={!!value && !showAnswer}
      onDragStart={(e) => {
        if (!value) return
        e.dataTransfer.setData('text/plain', value)
        e.dataTransfer.effectAllowed = 'move'
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        const label = e.dataTransfer.getData('text/plain')
        if (label) onDrop(zoneId, label)
      }}
      onClick={() => { if (value && !showAnswer) onReturnLabel(value) }}
      title={value && !showAnswer ? 'Drag to another box, or click to return to Labels Tray' : undefined}
    >
      {displayValue ?? ''}
    </div>
  )
}
