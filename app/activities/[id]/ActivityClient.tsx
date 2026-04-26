'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams, useRouter } from 'next/navigation'
import type { ActivityDefinition } from '@/data/activities'
import type { ActivityImage } from '@/data/activity-images'
import type { NavItem } from '@/lib/navigation'
import type { ViewMode } from '@/components/activity-templates/ViewTabs'
import { PrevNextNav } from '@/components/PrevNextNav'
import NameDescribe from '@/components/activity-templates/NameDescribe'
import Sequence from '@/components/activity-templates/Sequence'
import SortClassify from '@/components/activity-templates/SortClassify'
import LabelParts from '@/components/activity-templates/LabelParts'

interface Props {
  activity: ActivityDefinition
  images: Record<string, ActivityImage>
  yearLabel: string
  prev: NavItem | null
  next: NavItem | null
  sectionLabel: string | null
  sectionHref: string | null
}

const TEMPLATE_LABELS: Record<string, string> = {
  'name-describe': 'Name & Describe',
  sequence: 'Life Cycle',
  'sort-classify': 'Sort & Classify',
  'label-parts': 'Label the Parts',
}

function ActivityTemplate({
  activity,
  images,
  view,
}: {
  activity: ActivityDefinition
  images: Record<string, ActivityImage>
  view: ViewMode
}) {
  switch (activity.template) {
    case 'name-describe':
      return <NameDescribe activity={activity} images={images} view={view} />
    case 'sequence':
      return <Sequence activity={activity} images={images} view={view} />
    case 'sort-classify':
      return <SortClassify activity={activity} images={images} view={view} />
    case 'label-parts':
      return <LabelParts activity={activity} images={images} view={view} />
    default:
      return <p>Unknown activity template.</p>
  }
}

function PrintModal({
  activity,
  images,
  onClose,
}: {
  activity: ActivityDefinition
  images: Record<string, ActivityImage>
  onClose: () => void
}) {
  const [withAnswers, setWithAnswers] = useState(false)

  useEffect(() => {
    document.body.classList.add('print-modal-open')
    return () => document.body.classList.remove('print-modal-open')
  }, [])

  function copyLink() {
    const url = `${window.location.origin}/activities/${activity.id}?view=print`
    navigator.clipboard.writeText(url)
  }

  async function copyImage() {
    const el = document.querySelector('.print-modal-body .print-page') as HTMLElement | null
    if (!el) return
    const { toPng } = await import('html-to-image')
    const dataUrl = await toPng(el, { cacheBust: true })
    const blob = await (await fetch(dataUrl)).blob()
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
  }

  return createPortal(
    <div
      className="print-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="print-modal-inner">
        <div className="print-modal-toolbar">
          <span className="print-modal-title">{activity.title}</span>
          <div className="print-modal-answer-toggle" role="radiogroup" aria-label="Print version">
            <label className={`print-modal-radio${!withAnswers ? ' print-modal-radio--active' : ''}`}>
              <input type="radio" name="print-answers" checked={!withAnswers} onChange={() => setWithAnswers(false)} />
              Without answers
            </label>
            <label className={`print-modal-radio${withAnswers ? ' print-modal-radio--active' : ''}`}>
              <input type="radio" name="print-answers" checked={withAnswers} onChange={() => setWithAnswers(true)} />
              With answers
            </label>
          </div>
          <div className="print-modal-actions">
            <button className="print-modal-btn print-modal-btn--copy" onClick={copyLink}>
              Copy Link
            </button>
            <button className="print-modal-btn print-modal-btn--copy" onClick={copyImage}>
              Copy Image
            </button>
            <button className="print-modal-btn print-modal-btn--print" onClick={() => window.print()}>
              Print
            </button>
            <button className="print-modal-btn print-modal-btn--close" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
        <div className="print-modal-body">
          <ActivityTemplate activity={activity} images={images} view={withAnswers ? 'print-answers' : 'print'} />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function ActivityClient({
  activity,
  images,
  yearLabel,
  prev,
  next,
  sectionLabel,
  sectionHref,
}: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [view, setView] = useState<'interactive' | 'answers'>('interactive')
  const [printOpen, setPrintOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const v = searchParams.get('view')
    if (v === 'answers') setView('answers')
    if (v === 'print') {
      setPrintOpen(true)
      router.replace(`/activities/${activity.id}`, { scroll: false })
    }
  }, [])

  function switchView(v: 'interactive' | 'answers') {
    setView(v)
    router.replace(
      v === 'answers'
        ? `/activities/${activity.id}?view=answers`
        : `/activities/${activity.id}`,
      { scroll: false }
    )
  }

  const viewSuffix = view === 'answers' ? '?view=answers' : ''
  const navPrev = prev ? { ...prev, href: `${prev.href}${viewSuffix}` } : null
  const navNext = next ? { ...next, href: `${next.href}${viewSuffix}` } : null

  return (
    <article className="flex flex-col h-full w-full">
      <div className="flex-shrink-0 z-10 bg-white border-b border-slate-200" style={{ padding: '0.8rem 2rem' }}>
        <PrevNextNav
          prev={navPrev}
          next={navNext}
          sectionLabel={sectionLabel}
          sectionHref={sectionHref}
          title={activity.title}
        />
      </div>

      <div className="activity-toolbar flex-shrink-0">
        <div className="activity-toolbar__left">
          <span className="activity-page__year-badge">{yearLabel}</span>
          <span className="activity-page__template-badge">{TEMPLATE_LABELS[activity.template]}</span>
          <span className="activity-toolbar__description">{activity.description}</span>
        </div>
        <div className="activity-toolbar__tabs">
          <button
            className={`activity-tab${view === 'interactive' ? ' activity-tab--active' : ''}`}
            onClick={() => switchView('interactive')}
          >
            Interactive
          </button>
          <button
            className={`activity-tab${view === 'answers' ? ' activity-tab--active' : ''}`}
            onClick={() => switchView('answers')}
          >
            Answers
          </button>
          <button
            className="activity-tab"
            onClick={() => setPrintOpen(true)}
          >
            Print
          </button>
        </div>
      </div>

      <div className="main-scroll-area">
        <div className="activity-page">
          <ActivityTemplate activity={activity} images={images} view={view} />
        </div>
      </div>

      {mounted && printOpen && (
        <PrintModal
          activity={activity}
          images={images}
          onClose={() => setPrintOpen(false)}
        />
      )}
    </article>
  )
}
