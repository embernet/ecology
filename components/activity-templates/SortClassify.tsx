'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import type { ActivityDefinition } from '@/data/activities'
import type { ActivityImage } from '@/data/activity-images'
import type { ViewMode } from './ViewTabs'
import Celebration from './Celebration'
import PrintLayout from './PrintLayout'

interface SortClassifyProps {
  activity: ActivityDefinition
  images: Record<string, ActivityImage>
  view: ViewMode
}

export default function SortClassify({ activity, images, view }: SortClassifyProps) {
  const categories = activity.categories ?? []
  const allImageIds = activity.subjects.map((s) => s.image_id)

  // Map imageId → category label (correct answers)
  const correctMap = Object.fromEntries(
    categories.flatMap((cat) => cat.image_ids.map((id) => [id, cat.label]))
  )

  // State: which category each image is placed in (null = unsorted)
  const [placements, setPlacements] = useState<Record<string, string | null>>(
    Object.fromEntries(allImageIds.map((id) => [id, null]))
  )
  const [dragId, setDragId] = useState<string | null>(null)
  const [celebrate, setCelebrate] = useState(false)

  const isComplete = useCallback(
    () => allImageIds.every((id) => placements[id] === correctMap[id]),
    [placements, allImageIds, correctMap]
  )

  useEffect(() => {
    if (isComplete()) setCelebrate(true)
  }, [isComplete])

  function handleDrop(categoryLabel: string) {
    if (!dragId) return
    setPlacements((prev) => ({ ...prev, [dragId]: categoryLabel }))
    setDragId(null)
    setCelebrate(false)
  }

  function returnToPool(imageId: string) {
    setPlacements((prev) => ({ ...prev, [imageId]: null }))
    setCelebrate(false)
  }

  function handlePlayAgain() {
    setPlacements(Object.fromEntries(allImageIds.map((id) => [id, null])))
    setCelebrate(false)
  }

  if (view === 'print' || view === 'print-answers') {
    const withAnswers = view === 'print-answers'
    return (
      <PrintLayout
        title={activity.title}
        description={withAnswers ? activity.description : 'Cut out the pictures from the tray below and stick them in the correct group.'}
        wordBank={[]}
        activityId={activity.id}
      >
        <div className="sort-print-grid">
          {categories.map((cat) => (
            <div key={cat.label} className="sort-print-column">
              <div className="sort-print-heading">{cat.label}</div>
              {cat.image_ids.map((id) => {
                const img = images[id]
                return withAnswers ? (
                  <div key={id} className="sort-print-tray__item">
                    {img && (
                      <Image
                        src={`/activity-images/${img.filename}`}
                        alt={img.common_name}
                        width={90}
                        height={90}
                        className="sort-image"
                      />
                    )}
                    {img && <div className="sort-print-tray__name">{img.common_name}</div>}
                  </div>
                ) : (
                  <div key={id} className="sort-print-empty-slot" />
                )
              })}
            </div>
          ))}
        </div>

        {!withAnswers && (
          <div className="sort-print-tray">
            <div className="sort-print-tray__heading">Cut-out Images</div>
            <div className="sort-print-tray__images">
              {allImageIds.map((id) => {
                const img = images[id]
                return (
                  <div key={id} className="sort-print-tray__item">
                    {img && (
                      <Image
                        src={`/activity-images/${img.filename}`}
                        alt={img.common_name}
                        width={90}
                        height={90}
                        className="sort-image"
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

  const unsorted = allImageIds.filter((id) => placements[id] === null)

  return (
    <div className="sort-activity">
      <Celebration trigger={celebrate} />

      {/* Unsorted pool or Play Again */}
      {view === 'interactive' && (
        celebrate ? (
          <div className="play-again-wrap">
            <p>Well done — all sorted correctly!</p>
            <button className="play-again-btn" onClick={handlePlayAgain}>Play Again</button>
          </div>
        ) : unsorted.length > 0 && (
          <div
            className="sort-pool"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { if (dragId) returnToPool(dragId) }}
          >
            <p className="sort-pool__hint">Drag each picture into the correct group below</p>
            <div className="sort-pool__images">
              {unsorted.map((id) => {
                const img = images[id]
                return (
                  <div key={id} className="sort-item" draggable onDragStart={() => setDragId(id)}>
                    {img && (
                      <Image src={`/activity-images/${img.filename}`} alt={img.common_name}
                        width={110} height={110} className="sort-image" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      )}

      {/* Category buckets */}
      <div className="sort-categories">
        {categories.map((cat) => {
          const placedIds =
            view === 'answers'
              ? cat.image_ids
              : allImageIds.filter((id) => placements[id] === cat.label)

          return (
            <div
              key={cat.label}
              className="sort-bucket"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(cat.label)}
            >
              <div className="sort-bucket__label">{cat.label}</div>
              <div className="sort-bucket__items">
                {placedIds.map((id) => {
                  const img = images[id]
                  const isCorrect = correctMap[id] === cat.label
                  return (
                    <div
                      key={id}
                      className={`sort-item sort-item--placed ${view === 'interactive' && isCorrect ? 'sort-item--correct' : ''} ${view === 'interactive' && !isCorrect ? 'sort-item--incorrect' : ''}`}
                      onClick={() => view === 'interactive' && !celebrate && returnToPool(id)}
                      title={view === 'interactive' && !celebrate ? 'Click to return to pool' : undefined}
                    >
                      {img && (
                        <Image
                          src={`/activity-images/${img.filename}`}
                          alt={img.common_name}
                          width={110}
                          height={110}
                          className="sort-image"
                        />
                      )}
                      {(celebrate || view === 'answers') && img && (
                        <div className="sort-item__name">{img.common_name}</div>
                      )}
                    </div>
                  )
                })}
                {placedIds.length === 0 && (
                  <div className="sort-bucket__empty">Drop here</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
