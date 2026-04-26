'use client'

import { QRCodeSVG } from 'qrcode.react'

interface PrintLayoutProps {
  title: string
  description: string
  children: React.ReactNode
  wordBank: string[]
  activityId?: string
}

export default function PrintLayout({
  title,
  description,
  children,
  wordBank,
  activityId,
}: PrintLayoutProps) {
  const pageUrl = activityId
    ? `https://ecology.tapestrylab.net/activities/${activityId}`
    : 'https://ecology.tapestrylab.net'

  return (
    <div className="print-page">
      <div className="print-header">
        <h1 className="print-title">{title}</h1>
        <p className="print-instruction">{description}</p>
      </div>

      <div className="print-content">{children}</div>

      <div className="print-spacer" />

      {wordBank.length > 0 && (
        <div className="print-word-bank">
          <div className="print-word-bank__heading">WORD BANK</div>
          <div className="print-word-bank__words">
            {wordBank.map((word) => (
              <span key={word} className="print-word-bank__word">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="print-footer-banner">
        <QRCodeSVG value={pageUrl} size={48} className="print-footer-qr" />
        <div className="print-footer-brand">
          <span className="print-footer-icon" aria-hidden="true">🌱</span>
          <span className="print-footer-brand-name">Ecology Curriculum</span>
        </div>
        <span className="print-footer-text">
          This resource is available at{' '}
          <strong>ecology.tapestrylab.net</strong>
        </span>
      </div>
    </div>
  )
}
