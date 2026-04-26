'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import type { ActivityDefinition } from '@/data/activities'
import type { ActivityImage } from '@/data/activity-images'
import type { ViewMode } from './ViewTabs'
import Celebration from './Celebration'
import LabelStack from './LabelStack'
import PrintLayout from './PrintLayout'

interface LabelPartsProps {
  activity: ActivityDefinition
  images: Record<string, ActivityImage>
  view: ViewMode
}

export default function LabelParts({ activity, images, view }: LabelPartsProps) {
  const callouts = activity.callouts ?? []
  const correctMap = Object.fromEntries(callouts.map((c) => [c.role, c.label]))

  const [slots, setSlots] = useState<Record<string, string | null>>(
    Object.fromEntries(callouts.map((c) => [c.role, null]))
  )
  const [celebrate, setCelebrate] = useState(false)

  const isComplete = useCallback(
    () => callouts.every((c) => slots[c.role] === c.label),
    [slots, callouts]
  )

  useEffect(() => {
    if (isComplete()) setCelebrate(true)
  }, [isComplete])

  function handleDrop(role: string, label: string) {
    setSlots((prev) => {
      const next = { ...prev }
      for (const key of Object.keys(next)) {
        if (next[key] === label) next[key] = null
      }
      next[role] = label
      return next
    })
    setCelebrate(false)
  }

  function returnLabel(role: string) {
    setSlots((prev) => ({ ...prev, [role]: null }))
    setCelebrate(false)
  }

  function returnByLabel(label: string) {
    setSlots((prev) => {
      const next = { ...prev }
      for (const key of Object.keys(next)) {
        if (next[key] === label) next[key] = null
      }
      return next
    })
    setCelebrate(false)
  }

  function handlePlayAgain() {
    setSlots(Object.fromEntries(callouts.map((c) => [c.role, null])))
    setCelebrate(false)
  }

  const subjectImageId = activity.subjects[0]?.image_id
  const img = subjectImageId ? images[subjectImageId] : null

  const usedLabels = new Set(Object.values(slots).filter(Boolean) as string[])

  if (view === 'print' || view === 'print-answers') {
    const withAnswers = view === 'print-answers'
    return (
      <PrintLayout
        title={activity.title}
        description={activity.description}
        wordBank={withAnswers ? [] : (activity.label_pool ?? [])}
        activityId={activity.id}
      >
        <div className="lp-print-wrap">
          {img && (
            <div className="lp-image-container">
              <Image
                src={`/activity-images/${img.filename}`}
                alt={img.common_name}
                width={280}
                height={280}
                className="lp-image"
              />
              {callouts.map((c) => (
                <div
                  key={c.role}
                  className={`lp-drop-zone${withAnswers ? ' lp-drop-zone--filled lp-drop-zone--correct' : ' lp-drop-zone--empty'}`}
                  style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  {withAnswers ? c.label : ''}
                </div>
              ))}
            </div>
          )}
        </div>
      </PrintLayout>
    )
  }

  return (
    <div className="lp-activity">
      <Celebration trigger={celebrate} />

      <div className="lp-layout">
        <div className="lp-image-container">
          {img && (
            <Image
              src={`/activity-images/${img.filename}`}
              alt={img.common_name}
              width={380}
              height={380}
              className="lp-image"
            />
          )}

          {callouts.map((c) => {
            const value = view === 'answers' ? c.label : (slots[c.role] ?? null)
            const isCorrect = value === c.label
            return (
              <div
                key={c.role}
                className={`lp-drop-zone${value ? ' lp-drop-zone--filled' : ' lp-drop-zone--empty'}${value && isCorrect ? ' lp-drop-zone--correct' : ''}${value && !isCorrect ? ' lp-drop-zone--incorrect' : ''}`}
                style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%, -50%)' }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const label = e.dataTransfer.getData('text/plain')
                  if (label) handleDrop(c.role, label)
                }}
                onClick={() => view === 'interactive' && slots[c.role] && returnLabel(c.role)}
                title={slots[c.role] ? 'Click to return label' : undefined}
              >
                {value ?? ''}
              </div>
            )
          })}
        </div>

        {view === 'interactive' && (
          celebrate ? (
            <div className="play-again-wrap">
              <p>Well done — all correct!</p>
              <button className="play-again-btn" onClick={handlePlayAgain}>Play Again</button>
            </div>
          ) : (
            <LabelStack
              labels={activity.label_pool ?? []}
              usedLabels={usedLabels}
              onDragStart={() => {}}
              onReturnLabel={returnByLabel}
            />
          )
        )}
      </div>
    </div>
  )
}
