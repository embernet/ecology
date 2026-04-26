'use client'

import Link from 'next/link'
import ImageScrubber from './ImageScrubber'
import type { YearGroup, TemplateType } from '@/data/activities'

const TEMPLATE_LABELS: Record<TemplateType, string> = {
  'name-describe': 'Name & Describe',
  sequence: 'Life Cycle',
  'sort-classify': 'Sort & Classify',
  'label-parts': 'Label the Parts',
}

const YEAR_LABELS: Record<YearGroup, string> = {
  y12: 'Y1/2',
  y34: 'Y3/4',
  y56: 'Y5/6',
}

const YEAR_COLOURS: Record<YearGroup, string> = {
  y12: 'activity-badge--y12',
  y34: 'activity-badge--y34',
  y56: 'activity-badge--y56',
}

const TEMPLATE_COLOURS: Record<TemplateType, string> = {
  'name-describe': 'activity-template-badge--name-describe',
  sequence: 'activity-template-badge--sequence',
  'sort-classify': 'activity-template-badge--sort-classify',
  'label-parts': 'activity-template-badge--label-parts',
}

interface Props {
  id: string
  year_groups: YearGroup[]
  template: TemplateType
  description: string
  imageUrls: string[]
}

export default function ActivityCard({ id, year_groups, template, description, imageUrls }: Props) {
  return (
    <Link href={`/activities/${id}`} className="activity-card group">
      <ImageScrubber
        images={imageUrls}
        alt={description}
        height="h-36"
        objectFit="contain"
        className="rounded-t-lg border-b border-slate-100"
      />
      <div className="activity-card__body">
        <div className="activity-card__badges">
          {year_groups.map((yg) => (
            <span key={yg} className={`activity-badge ${YEAR_COLOURS[yg]}`}>
              {YEAR_LABELS[yg]}
            </span>
          ))}
          <span className={`activity-template-badge ${TEMPLATE_COLOURS[template]}`}>
            {TEMPLATE_LABELS[template]}
          </span>
        </div>
        <div className="activity-card__description">{description}</div>
      </div>
    </Link>
  )
}
