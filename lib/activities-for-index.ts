import { ACTIVITIES } from '@/data/activities'
import { ACTIVITY_IMAGES } from '@/data/activity-images'

const YEAR_GROUP_LABELS: Record<string, string> = {
  y12: 'Year 1/2',
  y34: 'Year 3/4',
  y56: 'Year 5/6',
}

const TEMPLATE_LABELS: Record<string, string> = {
  'name-describe': 'Name & Describe',
  'sequence': 'Sequence',
  'sort-classify': 'Sort & Classify',
  'label-parts': 'Label the Parts',
}

export interface ActivityIndexItem {
  id: string
  type: 'InteractiveActivity'
  title: string
  sourcePage: string
  sourcePageTitle: string
  exploreSlug: string
  activityHref: string
  data: {
    type: 'InteractiveActivity'
    title: string
    description: string
    childrenHtml: string
    activityImages: string[]
  }
}

export function getActivitiesForResourceIndex(): ActivityIndexItem[] {
  const imageMap = Object.fromEntries(
    ACTIVITY_IMAGES.map((img) => [img.id, img])
  )

  return ACTIVITIES.map((activity) => {
    const imageIds = [
      ...new Set([
        ...activity.subjects.map((s) => s.image_id),
        ...(activity.correct_order ?? []),
        ...(activity.categories ?? []).flatMap((c) => c.image_ids),
      ]),
    ].slice(0, 3)

    const activityImages = imageIds
      .map((id) => imageMap[id])
      .filter(Boolean)
      .map((img) => `/activity-images/${img.filename}`)

    const yearLabels = activity.year_groups
      .map((y) => YEAR_GROUP_LABELS[y] ?? y)
      .join(' · ')

    const templateLabel = TEMPLATE_LABELS[activity.template] ?? activity.template

    return {
      id: activity.id,
      type: 'InteractiveActivity' as const,
      title: activity.title,
      sourcePage: 'activities',
      sourcePageTitle: `${yearLabels} — ${templateLabel}`,
      exploreSlug: activity.id,
      activityHref: `/activities/${activity.id}`,
      data: {
        type: 'InteractiveActivity' as const,
        title: activity.title,
        description: activity.description,
        childrenHtml: '',
        activityImages,
      },
    }
  })
}
