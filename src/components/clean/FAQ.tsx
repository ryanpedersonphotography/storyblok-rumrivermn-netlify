// ===============================================================
// FILE: src/components/clean/FAQ.tsx
// Clean FAQ with robust Storyblok field handling + per-item fallbacks
// MIGRATED to unified Section component
// ===============================================================
'use client'

import { useEffect, useMemo, useState } from 'react'
import { storyblokEditable } from '@storyblok/react'
import { renderRichText } from '@storyblok/js'
import Section from '@/components/ui/SectionEnhanced'

type Blok = Record<string, any>

const FALLBACK_ITEMS = [
  { _uid: '1', question: 'Can we bring our own vendors?', answer: 'Absolutely! Bring any caterer, photographer, florist, DJ, and more.' },
  { _uid: '2', question: `What's included with the venue?`, answer: 'Exclusive use of the barn, suites, ceremony sites, tables/chairs for 200, parking, setup time, and day-of assistance.' },
  { _uid: '3', question: 'Indoor & outdoor options?', answer: 'Yes—multiple ceremony sites, including garden pavilion, riverside clearing, and the barn.' },
  { _uid: '4', question: 'Lodging nearby?', answer: 'Partner hotels and B&Bs with group rates; we can provide a recommended list.' },
]

function toHTML(value: any): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  try {
    return renderRichText(value) as unknown as string
  } catch {
    // flatten to plain text if it’s not valid RichText
    try {
      return JSON.stringify(value)
    } catch {
      return ''
    }
  }
}

function firstArray(blok: Blok, keys: string[]): any[] | null {
  for (const k of keys) {
    const v = blok?.[k]
    if (Array.isArray(v) && v.length) return v
  }
  // if an empty array exists under any candidate key, return it (so we don’t fall back wrongly)
  for (const k of keys) {
    if (Array.isArray(blok?.[k])) return []
  }
  return null
}

export default function FAQ({ blok }: { blok: Blok }) {
  const [open, setOpen] = useState<Record<string, boolean>>({})

  // Detect the list field Storyblok is actually using
  const rawList =
    firstArray(blok, ['faq_items', 'items', 'faqs', 'faq', 'accordion_items']) ??
    FALLBACK_ITEMS

  const items = useMemo(() => {
    return (rawList.length ? rawList : FALLBACK_ITEMS).map((it: any, i: number) => {
      const uid = it?._uid ?? String(i)
      const question =
        it?.question ?? it?.title ?? it?.heading ?? it?.label ?? 'Untitled question'

      // Try common Storyblok answer fields (rich text or plain)
      const rawAnswer =
        it?.answer ??
        it?.rich_text ??
        it?.body ??
        it?.text ??
        it?.copy ??
        it?.description ??
        ''

      let answerHTML = toHTML(rawAnswer)

      // If answer missing/empty, provide a per-item fallback
      if (!answerHTML || /^\s*$/.test(answerHTML)) {
        const fb = FALLBACK_ITEMS[i % FALLBACK_ITEMS.length]
        answerHTML = toHTML(fb.answer)
      }

      return { uid, question: String(question), answerHTML }
    })
  }, [rawList])

  // Open first item for easy visual verification
  useEffect(() => {
    if (items[0]) setOpen((s) => ({ ...s, [items[0].uid]: true }))
  }, [items])

  const title = blok?.title || 'Frequently Asked Questions'
  const subtitle = blok?.subtitle || 'Everything You Need to Know'
  const toggle = (id: string) => setOpen((s) => ({ ...s, [id]: !s[id] }))

  // Debug: uncomment while diagnosing field shapes
  // useEffect(() => { console.log('[FAQ blok]', JSON.parse(JSON.stringify(blok))) }, [blok])

  return (
    <Section
      as="section"
      align="center"
      width="prose"
      paddingY="lg"
      background="surface"
      header={{
        scriptAccent: subtitle,
        title: title,
        align: 'center'
      }}
      headerSlotProps={{
        'data-test-id': 'faq-header',
        style: { scrollMarginTop: '80px' }  // Smooth scroll offset
      }}
      contentSlotProps={{
        'data-test-id': 'faq-content',
        'aria-label': 'Frequently asked questions list'
      }}
      className="faq-accordion"
      data-section="faq"
      {...storyblokEditable(blok)}
    >
      <div className="faq-list">
        {items.map((it) => {
          const isOpen = !!open[it.uid]
          return (
            <div key={it.uid} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="faq-question"
                onClick={() => toggle(it.uid)}
                aria-expanded={isOpen}
                aria-controls={`answer-${it.uid}`}
              >
                <h3>{it.question}</h3>
                <span className="faq-toggle" aria-hidden>↓</span>
              </button>

              <div
                id={`answer-${it.uid}`}
                className="faq-answer"
                role="region"
                aria-live="polite"
              >
                <div className="faq-answer-body" dangerouslySetInnerHTML={{ __html: it.answerHTML }} />
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}