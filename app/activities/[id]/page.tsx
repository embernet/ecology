import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ACTIVITIES, getActivityById } from '@/data/activities'
import { ACTIVITY_IMAGES } from '@/data/activity-images'
import { getActivitySiblings } from '@/lib/navigation'
import ActivityClient from './ActivityClient'

interface Props {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return ACTIVITIES.map((a) => ({ id: a.id }))
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const activity = getActivityById(id)
  return { title: activity ? `${activity.title} — Ecology Curriculum` : 'Activity' }
}

export default async function ActivityPage({ params }: Props) {
  const { id } = await params
  const activity = getActivityById(id)
  if (!activity) notFound()

  const imageMap = Object.fromEntries(ACTIVITY_IMAGES.map((img) => [img.id, img]))

  const yearLabel = activity.year_groups
    .map((yg) => (yg === 'y12' ? 'Y1/2' : yg === 'y34' ? 'Y3/4' : 'Y5/6'))
    .join(' & ')

  const siblings = getActivitySiblings(id)

  return (
    <Suspense>
      <ActivityClient
        activity={activity}
        images={imageMap}
        yearLabel={yearLabel}
        prev={siblings.prev}
        next={siblings.next}
        sectionLabel={siblings.sectionLabel}
        sectionHref={siblings.sectionHref}
      />
    </Suspense>
  )
}
