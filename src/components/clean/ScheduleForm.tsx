'use client'

import { useState } from 'react'
import { storyblokEditable } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'

interface ScheduleFormStoryblok extends SbBlokData {
  title?: string
  subtitle?: string
  description?: string
  submit_text?: string
}

export default function ScheduleForm({ blok }: { blok: ScheduleFormStoryblok }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted:', formData);
  };

  const title = blok.title || 'Schedule a Tour'
  const subtitle = blok.subtitle || 'Plan Your Visit'
  const description = blok.description || 'Experience the magic of Rum River Barn in person. Book your private tour today.'
  const submitText = blok.submit_text || 'Schedule Your Tour'

  return (
    <section {...storyblokEditable(blok)} className="schedule-tour" data-section="schedule-form">
        <div className="form-container">
        <div className="form-header">
          <span className="form-script">{subtitle}</span>
          <h2 className="form-title">{title}</h2>
          <p className="form-description">
            {description}
          </p>
        </div>

        <form className="tour-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="John & Jane Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Preferred Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="guests" className="form-label">
              Expected Guest Count
            </label>
            <select
              id="guests"
              name="guests"
              className="form-select"
              value={formData.guests}
              onChange={handleChange}
            >
              <option value="">Select guest count</option>
              <option value="1-50">1-50 guests</option>
              <option value="51-100">51-100 guests</option>
              <option value="101-150">101-150 guests</option>
              <option value="151-200">151-200 guests</option>
              <option value="200+">200+ guests</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">
              Tell Us About Your Vision
            </label>
            <textarea
              id="message"
              name="message"
              className="form-textarea"
              placeholder="Share your dream wedding details, special requests, or questions..."
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="form-submit">
            {submitText}
          </button>
        </form>
      </div>
    </section>
  );
}
