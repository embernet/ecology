import { ACTIVITIES } from '@/data/activities'
import { ACTIVITY_IMAGES } from '@/data/activity-images'
import ActivityCard from '@/components/ActivityCard'

const TOPIC_ORDER = [
  'Butterfly or Moth?',
  'Name the Butterfly',
  'Name the Moth',
  'Name the Wildflower',
  'Frog or Toad?',
  'Slug or Snail?',
  'Name the Snail',
  'Frog Life Cycle',
  'Toad Life Cycle',
  'Butterfly Life Cycle',
  'Sort: Butterflies and Moths',
  'Sort: Frogs and Toads',
  'Sort: Slugs and Snails',
  'Parts of a Butterfly',
  'Parts of a Flower',
  'Parts of a Snail',
]

type TopicGroup = { title: string; activities: typeof ACTIVITIES }

function groupByTopic(): TopicGroup[] {
  const map = new Map<string, typeof ACTIVITIES>()
  for (const a of ACTIVITIES) {
    const existing = map.get(a.title) ?? []
    map.set(a.title, [...existing, a])
  }
  const groups: TopicGroup[] = []
  for (const title of TOPIC_ORDER) {
    if (map.has(title)) groups.push({ title, activities: map.get(title)! })
  }
  for (const [title, activities] of map) {
    if (!TOPIC_ORDER.includes(title)) groups.push({ title, activities })
  }
  return groups
}

export const metadata = {
  title: 'Interactive Activities — Ecology Curriculum',
}

export default function ActivitiesPage() {
  const groups = groupByTopic()
  const imageMap = Object.fromEntries(ACTIVITY_IMAGES.map((img) => [img.id, img]))

  return (
    <div className="main-scroll-area">
      <div className="activities-landing">
        <div className="activities-landing__header">
          <h1 className="activities-landing__title">Interactive Activities</h1>
          <p className="activities-landing__intro">
            Interactive and printable activities for nature and ecology. Each activity has three
            views: interactive drag-and-drop, answers, and a printable A4 worksheet.
            Activities are available for Year 1/2, Year 3/4, and Year 5/6.
          </p>
        </div>

        <div className="activities-landing__groups">
          {groups.map(({ title, activities }) => (
            <div key={title} className="activity-group">
              <h2 className="activity-group__title">{title}</h2>
              <div className="activity-group__cards">
                {activities.map((a) => {
                  const imageUrls = a.subjects
                    .map((s) => imageMap[s.image_id])
                    .filter(Boolean)
                    .map((img) => `/activity-images/${img.filename}`)
                  return (
                    <ActivityCard
                      key={a.id}
                      id={a.id}
                      year_groups={a.year_groups}
                      template={a.template}
                      description={a.description}
                      imageUrls={imageUrls}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
