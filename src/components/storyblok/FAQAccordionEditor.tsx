'use client'

import { storyblokEditable } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'
import { useState } from 'react'

interface FAQItem {
  _uid: string
  question: string
  answer: string
}

interface FAQAccordionStoryblok extends SbBlokData {
  title?: string
  subtitle?: string
  faq_items?: FAQItem[]
}

export default function FAQAccordionEditor({ blok }: { blok: FAQAccordionStoryblok }) {
  const [activeItems, setActiveItems] = useState<{ [key: string]: boolean }>({})

  const defaultFAQs: FAQItem[] = [
    {
      _uid: '1',
      question: 'Can we bring our own vendors?',
      answer: 'Absolutely! We believe in giving you complete creative freedom for your wedding day. You\'re welcome to work with any caterer, photographer, florist, DJ, or other vendors you choose.'
    },
    {
      _uid: '2',
      question: 'What\'s included with the venue rental?',
      answer: 'Your rental includes exclusive use of our historic barn, bridal suite, groom\'s quarters, outdoor ceremony sites, and tables and chairs for up to 200 guests. We also provide parking, setup time, and day-of coordination assistance.'
    },
    {
      _uid: '3',
      question: 'Do you have indoor and outdoor options?',
      answer: 'Yes! Our property offers multiple ceremony sites including our beautiful garden pavilion, riverside clearing, and the barn itself. This gives you backup options regardless of weather.'
    },
    {
      _uid: '4',
      question: 'Is there lodging nearby for guests?',
      answer: 'We have partnerships with several nearby hotels and bed & breakfasts that offer group rates. We\'re also happy to provide a list of recommended accommodations in the area for your out-of-town guests.'
    }
  ]

  const faqItems = blok.faq_items && blok.faq_items.length > 0 ? blok.faq_items : defaultFAQs
  const title = blok.title || 'Frequently Asked Questions'
  const subtitle = blok.subtitle || 'Everything You Need to Know'

  const toggleItem = (uid: string) => {
    setActiveItems(prev => ({
      ...prev,
      [uid]: !prev[uid]
    }))
  }

  return (
      <section {...storyblokEditable(blok)} className="faq-accordion-section" data-section="faq">
        <div className="faq-container">
        <div className="faq-header">
          <p className="faq-script">{subtitle}</p>
          <h2 className="faq-title">{title}</h2>
        </div>

        <div className="faq-items">
          {faqItems.map((item) => {
            const isActive = activeItems[item._uid]
            return (
              <div
                key={item._uid}
                className={`faq-item ${isActive ? 'active' : ''}`}
              >
                <div
                  className="faq-question"
                  onClick={() => toggleItem(item._uid)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      toggleItem(item._uid)
                    }
                  }}
                >
                  <h3>{item.question}</h3>
                  <span className="faq-toggle">↓</span>
                </div>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
