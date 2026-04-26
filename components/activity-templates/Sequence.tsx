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

export default function Sequence({ activity, images, view }: SequenceProps) {
  const correctOrder = activity.correct_order ?? []
  const stageLabels = activity.stage_labels ?? {}
  const n = correctOrder.length

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

  if (view === 'print' || view === 'print-answers') {
    const withAnswers = view === 'print-answers'
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

  const displaySlots = view === 'answers'
    ? correctOrder.map((id) => id)
    : slots

  return (
    <div className="seq-activity">
      <Celebration trigger={celebrate} />

      {/* Numbered slots */}
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

      {/* Images Tray / Play Again — hidden in answers view */}
      {view === 'interactive' && (
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
      )}
    </div>
  )
}
