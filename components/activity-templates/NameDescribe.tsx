'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import type { ActivityDefinition } from '@/data/activities'
import type { ActivityImage } from '@/data/activity-images'
import type { ViewMode } from './ViewTabs'
import LabelStack from './LabelStack'
import DropZone from './DropZone'
import Celebration from './Celebration'
import PrintLayout from './PrintLayout'

interface NameDescribeProps {
  activity: ActivityDefinition
  images: Record<string, ActivityImage>
  view: ViewMode
}

interface Slots {
  [zoneId: string]: string | null
}

function buildZoneId(role: string, type: 'name' | 'desc', index?: number) {
  return type === 'name' ? `${role}__name` : `${role}__desc__${index}`
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function NameDescribe({ activity, images, view }: NameDescribeProps) {
  const descCount = activity.description_box_count ?? 2
  const pool = activity.label_pool ?? []

  // Initialise slots: one name + N desc per subject
  function initSlots(): Slots {
    const slots: Slots = {}
    for (const { role } of activity.subjects) {
      slots[buildZoneId(role, 'name')] = null
      for (let i = 0; i < descCount; i++) {
        slots[buildZoneId(role, 'desc', i)] = null
      }
    }
    return slots
  }

  const [slots, setSlots] = useState<Slots>(initSlots)
  const [shuffledPool, setShuffledPool] = useState<string[]>(pool)
  const [dragging, setDragging] = useState<string | null>(null)

  // Shuffle only on client after hydration to avoid SSR mismatch
  useEffect(() => {
    setShuffledPool(shuffled(pool))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [celebrate, setCelebrate] = useState(false)

  // Compute which labels are in use
  const usedLabels = new Set(Object.values(slots).filter(Boolean) as string[])

  // Check completion
  const isComplete = useCallback(() => {
    for (const { role } of activity.subjects) {
      const nameZone = buildZoneId(role, 'name')
      if (slots[nameZone] !== activity.name_labels?.[role]) return false
      const descs = activity.description_labels?.[role] ?? []
      const placed = Array.from({ length: descCount }, (_, i) => slots[buildZoneId(role, 'desc', i)]).filter(Boolean)
      for (const d of descs) {
        if (!placed.includes(d)) return false
      }
    }
    return true
  }, [slots, activity, descCount])

  useEffect(() => {
    if (isComplete()) setCelebrate(true)
  }, [isComplete])

  function handleDrop(zoneId: string, label: string) {
    setSlots((prev) => {
      const next = { ...prev }
      // Return any existing label in target zone
      // Place new label — if it was in another zone, clear that zone
      for (const key of Object.keys(next)) {
        if (next[key] === label) next[key] = null
      }
      next[zoneId] = label
      return next
    })
    setCelebrate(false)
  }

  function handleReturnLabel(label: string) {
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
    setSlots(initSlots())
    setShuffledPool(shuffled(pool))
    setCelebrate(false)
  }

  if (view === 'print' || view === 'print-answers') {
    const withAnswers = view === 'print-answers'
    return (
      <PrintLayout
        title={activity.title}
        description={activity.description}
        wordBank={withAnswers ? [] : pool}
        activityId={activity.id}
      >
        <div className="nd-subjects nd-subjects--print">
          {activity.subjects.map(({ role, image_id }) => {
            const img = images[image_id]
            const name = activity.name_labels?.[role] ?? ''
            const descs = activity.description_labels?.[role] ?? []
            return (
              <div key={role} className="nd-subject nd-subject--print">
                <div className="nd-image-wrap nd-image-wrap--print">
                  {img && (
                    <Image
                      src={`/activity-images/${img.filename}`}
                      alt={img.common_name}
                      width={180}
                      height={180}
                      className="nd-image"
                    />
                  )}
                </div>
                <div className="nd-zone-label nd-zone-label--name">NAME</div>
                {withAnswers ? (
                  <div className="drop-zone drop-zone--name drop-zone--print-filled">{name}</div>
                ) : (
                  <div className="drop-zone drop-zone--name drop-zone--print-blank" />
                )}
                <div className="nd-zone-label nd-zone-label--desc">DESCRIPTION</div>
                {Array.from({ length: descCount }, (_, i) => (
                  withAnswers ? (
                    <div key={i} className="drop-zone drop-zone--description drop-zone--print-filled">{descs[i] ?? ''}</div>
                  ) : (
                    <div key={i} className="drop-zone drop-zone--description drop-zone--print-blank" />
                  )
                ))}
              </div>
            )
          })}
        </div>
      </PrintLayout>
    )
  }

  const showAnswer = view === 'answers'

  return (
    <div className="nd-activity">
      <Celebration trigger={celebrate} />

      <div className="nd-subjects">
        {activity.subjects.map(({ role, image_id }) => {
          const img = images[image_id]
          const nameZone = buildZoneId(role, 'name')
          const correctName = activity.name_labels?.[role] ?? ''
          const correctDescs = activity.description_labels?.[role] ?? []

          return (
            <div key={role} className="nd-subject">
              <div className="nd-image-wrap">
                {img && (
                  <Image
                    src={`/activity-images/${img.filename}`}
                    alt={img.common_name}
                    width={220}
                    height={220}
                    className="nd-image"
                  />
                )}
              </div>

              <div className="nd-zone-label nd-zone-label--name">NAME</div>
              <DropZone
                zoneId={nameZone}
                type="name"
                value={slots[nameZone] ?? null}
                correct={correctName}
                showAnswer={showAnswer}
                onDrop={handleDrop}
                onReturnLabel={handleReturnLabel}
              />

              <div className="nd-zone-label nd-zone-label--desc">DESCRIPTION</div>
              {Array.from({ length: descCount }, (_, i) => {
                const zoneId = buildZoneId(role, 'desc', i)
                return (
                  <DropZone
                    key={zoneId}
                    zoneId={zoneId}
                    type="description"
                    value={slots[zoneId] ?? null}
                    correct={correctDescs[i] ?? ''}
                    showAnswer={showAnswer}
                    onDrop={handleDrop}
                    onReturnLabel={handleReturnLabel}
                  />
                )
              })}
            </div>
          )
        })}
      </div>

      {!showAnswer && (
        celebrate ? (
          <div className="play-again-wrap">
            <p>Well done — all correct!</p>
            <button className="play-again-btn" onClick={handlePlayAgain}>Play Again</button>
          </div>
        ) : (
          <LabelStack
            labels={shuffledPool}
            usedLabels={usedLabels}
            onDragStart={setDragging}
            onReturnLabel={handleReturnLabel}
          />
        )
      )}
    </div>
  )
}
