'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import type { ActivityDefinition } from '@/data/activities'
import type { ActivityImage } from '@/data/activity-images'
import type { ViewMode } from './ViewTabs'
import Celebration from './Celebration'
import PrintLayout from './PrintLayout'

interface SequenceProps {
  activity: ActivityDefinition
  images: Record<string, ActivityImage>
  view: ViewMode
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Lifecycle circle helpers ──────────────────────────────────────────────

const LC_CONTAINER = 600
const LC_CENTER = LC_CONTAINER / 2  // 300
const LC_PRINT_CONTAINER = 500
const LC_PRINT_CENTER = LC_PRINT_CONTAINER / 2  // 250

function lcSlotRadius(n: number, print = false): number {
  const sizes = print ? [158, 152, 143] : [190, 182, 172]
  return n <= 4 ? sizes[0] : n <= 5 ? sizes[1] : sizes[2]
}

function lcImgSize(print = false): number {
  return print ? 90 : 120
}

function lcStagePos(i: number, n: number, center: number, slotR: number) {
  const angle = (2 * Math.PI * i) / n - Math.PI / 2
  return {
    cx: center + slotR * Math.cos(angle),
    cy: center + slotR * Math.sin(angle),
  }
}

function lcArrowPaths(n: number, center: number, slotR: number, imgHalf: number): string[] {
  const arrowR = slotR + imgHalf + 14
  const clearRad = Math.asin(imgHalf / arrowR) + 0.07
  return Array.from({ length: n }, (_, i) => {
    const fromAngle = (2 * Math.PI * i) / n - Math.PI / 2
    const toAngle = (2 * Math.PI * (i + 1)) / n - Math.PI / 2
    const startAngle = fromAngle + clearRad
    const endAngle = toAngle - clearRad
    const x1 = center + arrowR * Math.cos(startAngle)
    const y1 = center + arrowR * Math.sin(startAngle)
    const x2 = center + arrowR * Math.cos(endAngle)
    const y2 = center + arrowR * Math.sin(endAngle)
    const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${arrowR.toFixed(0)} ${arrowR.toFixed(0)} 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`
  })
}

// ──────────────────────────────────────────────────────────────────────────

export default function Sequence({ activity, images, view }: SequenceProps) {
  const correctOrder = activity.correct_order ?? []
  const stageLabels = activity.stage_labels ?? {}
  const n = correctOrder.length
  const isLifecycle = activity.template === 'lifecycle'

  // slots[i] = image ID placed in slot i, or null (all start empty)
  const [slots, setSlots] = useState<(string | null)[]>(Array(n).fill(null))
  const [trayOrder, setTrayOrder] = useState<string[]>(correctOrder)
  const [trayDragOver, setTrayDragOver] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [ready, setReady] = useState(false)

  // Shuffle tray on client after hydration to avoid SSR mismatch
  useEffect(() => {
    setTrayOrder(shuffled(correctOrder))
    setReady(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const usedImages = new Set(slots.filter(Boolean) as string[])
  const trayImages = trayOrder.filter((id) => !usedImages.has(id))

  const isComplete = useCallback(
    () => ready && slots.every((id, i) => id === correctOrder[i]),
    [slots, correctOrder, ready]
  )

  useEffect(() => {
    if (isComplete()) setCelebrate(true)
  }, [isComplete])

  function placeInSlot(slotIndex: number, imageId: string) {
    setSlots((prev) => {
      const next = [...prev]
      for (let i = 0; i < next.length; i++) {
        if (next[i] === imageId) next[i] = null
      }
      next[slotIndex] = imageId
      return next
    })
    setCelebrate(false)
  }

  function returnToTray(imageId: string) {
    setSlots((prev) => prev.map((id) => (id === imageId ? null : id)))
    setCelebrate(false)
  }

  function handlePlayAgain() {
    setSlots(Array(n).fill(null))
    setTrayOrder(shuffled(correctOrder))
    setCelebrate(false)
  }

  // ── Print views ──────────────────────────────────────────────────────────

  if (view === 'print' || view === 'print-answers') {
    const withAnswers = view === 'print-answers'

    if (isLifecycle) {
      const slotR = lcSlotRadius(n, true)
      const imgSize = lcImgSize(true)
      const imgHalf = imgSize / 2
      const arrowPaths = lcArrowPaths(n, LC_PRINT_CENTER, slotR, imgHalf)
      const cardHalf = 65
      const imgOffsetFromTop = 24 + 4 + imgHalf  // number + gap + half-image

      return (
        <PrintLayout
          title={activity.title}
          description={withAnswers
            ? activity.description
            : 'Cut out the images below. Paste them into the circle in the correct order to show the life cycle.'}
          wordBank={[]}
          activityId={activity.id}
        >
          <div style={{ position: 'relative', width: LC_PRINT_CONTAINER, height: LC_PRINT_CONTAINER, margin: '0 auto', flexShrink: 0 }}>
            <svg
              width={LC_PRINT_CONTAINER}
              height={LC_PRINT_CONTAINER}
              style={{ position: 'absolute', top: 0, left: 0 }}
              aria-hidden="true"
            >
              <defs>
                <marker id="lc-arrow-p" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <path d="M0 0 L8 3 L0 6 Z" fill="#0d9488" />
                </marker>
              </defs>
              {arrowPaths.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="#0d9488" strokeWidth="2" markerEnd="url(#lc-arrow-p)" />
              ))}
            </svg>

            {correctOrder.map((id, i) => {
              const { cx, cy } = lcStagePos(i, n, LC_PRINT_CENTER, slotR)
              const img = images[id]
              return (
                <div
                  key={id}
                  style={{
                    position: 'absolute',
                    left: `${cx - cardHalf}px`,
                    top: `${cy - imgOffsetFromTop}px`,
                    width: '130px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <div className="seq-number-box">{i + 1}</div>
                  {withAnswers && img ? (
                    <Image
                      src={`/activity-images/${img.filename}`}
                      alt={img.common_name}
                      width={imgSize}
                      height={imgSize}
                      className="seq-image"
                      style={{ width: imgSize, height: imgSize, borderRadius: '0.5rem', objectFit: 'contain' }}
                    />
                  ) : (
                    <div style={{ width: imgSize, height: imgSize, border: '1.5px dashed #94a3b8', background: '#f9fafb', borderRadius: '0.5rem' }} />
                  )}
                  {withAnswers && (
                    <div style={{ fontSize: '0.65rem', textAlign: 'center', color: '#1e293b', width: '130px', lineHeight: 1.3 }}>
                      {stageLabels[id] ?? ''}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {!withAnswers && (
            <div className="seq-print-tray">
              <p className="seq-tray__heading">Images to cut out</p>
              <div className="seq-tray__images">
                {trayOrder.map((id) => {
                  const img = images[id]
                  return (
                    <div key={id} className="seq-tray-image seq-tray-image--print">
                      {img && (
                        <Image
                          src={`/activity-images/${img.filename}`}
                          alt={img.common_name}
                          width={100}
                          height={100}
                          className="seq-image"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </PrintLayout>
      )
    }

    // Linear sequence print layout
    return (
      <PrintLayout
        title={activity.title}
        description={withAnswers ? activity.description : `Cut out the images below. Paste them into the boxes in the correct order.`}
        wordBank={[]}
        activityId={activity.id}
      >
        <div className="seq-grid seq-grid--print">
          {correctOrder.map((id, i) => {
            const img = images[id]
            return (
              <div key={id} className="seq-card seq-card--print">
                <div className="seq-number-box">{i + 1}</div>
                {withAnswers ? (
                  img && (
                    <Image
                      src={`/activity-images/${img.filename}`}
                      alt={img.common_name}
                      width={120}
                      height={120}
                      className="seq-image"
                    />
                  )
                ) : (
                  <div className="seq-print-empty-slot" />
                )}
                {withAnswers ? (
                  <div className="seq-label-box seq-label-box--filled">{stageLabels[id] ?? ''}</div>
                ) : (
                  <div className="seq-label-box" />
                )}
              </div>
            )
          })}
        </div>

        {!withAnswers && (
          <div className="seq-print-tray">
            <p className="seq-tray__heading">Images Tray</p>
            <div className="seq-tray__images">
              {trayOrder.map((id) => {
                const img = images[id]
                return (
                  <div key={id} className="seq-tray-image seq-tray-image--print">
                    {img && (
                      <Image
                        src={`/activity-images/${img.filename}`}
                        alt={img.common_name}
                        width={100}
                        height={100}
                        className="seq-image"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </PrintLayout>
    )
  }

  // ── Interactive / Answers views ──────────────────────────────────────────

  const displaySlots = view === 'answers'
    ? correctOrder.map((id) => id)
    : slots

  const tray = (
    celebrate ? (
      <div className="play-again-wrap">
        <p>Well done — all in the right order!</p>
        <button className="play-again-btn" onClick={handlePlayAgain}>Play Again</button>
      </div>
    ) : (
      <div
        className={`seq-tray${trayDragOver ? ' seq-tray--drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setTrayDragOver(true) }}
        onDragLeave={() => setTrayDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setTrayDragOver(false)
          const id = e.dataTransfer.getData('text/plain')
          if (id) returnToTray(id)
        }}
      >
        <p className="seq-tray__heading">Images Tray</p>
        {trayImages.length === 0 ? (
          <p className="seq-tray__hint">All images placed — drag one back here to change it</p>
        ) : (
          <div className="seq-tray__images">
            {trayImages.map((id) => {
              const img = images[id]
              return (
                <div
                  key={id}
                  className="seq-tray-image"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', id)
                    e.dataTransfer.effectAllowed = 'move'
                  }}
                >
                  {img && (
                    <Image
                      src={`/activity-images/${img.filename}`}
                      alt={img.common_name}
                      width={120}
                      height={120}
                      className="seq-image"
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  )

  // ── Lifecycle: circular layout ──────────────────────────────────────────

  if (isLifecycle) {
    const slotR = lcSlotRadius(n)
    const imgSize = lcImgSize()
    const imgHalf = imgSize / 2
    const arrowPaths = lcArrowPaths(n, LC_CENTER, slotR, imgHalf)
    const cardHalf = 65
    const imgOffsetFromTop = 24 + 4 + imgHalf  // number(24) + gap(4) + half-image

    return (
      <div className="seq-activity">
        <Celebration trigger={celebrate} />

        <div style={{ position: 'relative', width: LC_CONTAINER, height: LC_CONTAINER, flexShrink: 0 }}>
          <svg
            width={LC_CONTAINER}
            height={LC_CONTAINER}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
            aria-hidden="true"
          >
            <defs>
              <marker id="lc-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <path d="M0 0 L8 3 L0 6 Z" fill="#0d9488" />
              </marker>
            </defs>
            {arrowPaths.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="#0d9488" strokeWidth="2.5" markerEnd="url(#lc-arrow)" />
            ))}
          </svg>

          {Array.from({ length: n }, (_, i) => {
            const imageId = displaySlots[i] ?? null
            const img = imageId ? images[imageId] : null
            const label = stageLabels[correctOrder[i]]
            const isCorrect = view === 'answers' || imageId === correctOrder[i]
            const { cx, cy } = lcStagePos(i, n, LC_CENTER, slotR)

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${cx - cardHalf}px`,
                  top: `${cy - imgOffsetFromTop}px`,
                  width: '130px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <div className="seq-slot__number">{i + 1}</div>
                <div
                  className={`seq-slot__image-area ${imageId
                    ? (isCorrect ? 'seq-slot__image-area--correct' : 'seq-slot__image-area--incorrect')
                    : 'seq-slot__image-area--empty'}`}
                  style={{ width: imgSize, height: imgSize }}
                  draggable={!!imageId && view === 'interactive'}
                  onDragStart={(e) => {
                    if (!imageId || view !== 'interactive') return
                    e.dataTransfer.setData('text/plain', imageId)
                    e.dataTransfer.effectAllowed = 'move'
                  }}
                  onDragOver={(e) => {
                    if (view !== 'interactive') return
                    e.preventDefault()
                    e.dataTransfer.dropEffect = 'move'
                  }}
                  onDrop={(e) => {
                    if (view !== 'interactive') return
                    e.preventDefault()
                    const id = e.dataTransfer.getData('text/plain')
                    if (id) placeInSlot(i, id)
                  }}
                  onClick={() => {
                    if (imageId && view === 'interactive') returnToTray(imageId)
                  }}
                  title={imageId && view === 'interactive'
                    ? 'Drag to another slot, or click to return to tray'
                    : undefined}
                >
                  {img && (
                    <Image
                      src={`/activity-images/${img.filename}`}
                      alt={img.common_name}
                      width={imgSize}
                      height={imgSize}
                      className="seq-image"
                    />
                  )}
                </div>
                {label && <div className="seq-slot__label" style={{ width: '130px' }}>{label}</div>}
              </div>
            )
          })}
        </div>

        {view === 'interactive' && tray}
      </div>
    )
  }

  // ── Linear sequence layout ───────────────────────────────────────────────

  return (
    <div className="seq-activity">
      <Celebration trigger={celebrate} />

      <div className="seq-slots">
        {Array.from({ length: n }, (_, i) => {
          const imageId = displaySlots[i] ?? null
          const img = imageId ? images[imageId] : null
          const label = stageLabels[correctOrder[i]]
          const isCorrect = view === 'answers' || imageId === correctOrder[i]

          return (
            <div key={i} className="seq-slot">
              <div className="seq-slot__number">{i + 1}</div>
              <div
                className={`seq-slot__image-area ${imageId
                  ? (isCorrect ? 'seq-slot__image-area--correct' : 'seq-slot__image-area--incorrect')
                  : 'seq-slot__image-area--empty'}`}
                draggable={!!imageId && view === 'interactive'}
                onDragStart={(e) => {
                  if (!imageId || view !== 'interactive') return
                  e.dataTransfer.setData('text/plain', imageId)
                  e.dataTransfer.effectAllowed = 'move'
                }}
                onDragOver={(e) => {
                  if (view !== 'interactive') return
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'move'
                }}
                onDrop={(e) => {
                  if (view !== 'interactive') return
                  e.preventDefault()
                  const id = e.dataTransfer.getData('text/plain')
                  if (id) placeInSlot(i, id)
                }}
                onClick={() => {
                  if (imageId && view === 'interactive') returnToTray(imageId)
                }}
                title={imageId && view === 'interactive'
                  ? 'Drag to another slot, or click to return to tray'
                  : undefined}
              >
                {img && (
                  <Image
                    src={`/activity-images/${img.filename}`}
                    alt={img.common_name}
                    width={140}
                    height={140}
                    className="seq-image"
                  />
                )}
              </div>
              {label && <div className="seq-slot__label">{label}</div>}
            </div>
          )
        })}
      </div>

      {view === 'interactive' && tray}
    </div>
  )
}
