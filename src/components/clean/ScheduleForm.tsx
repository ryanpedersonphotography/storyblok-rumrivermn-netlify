'use client'

import { useState } from 'react'

export default function ScheduleForm() {
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

  return (
    <section className="schedule">
      <div className="schedule__container">
        <div className="schedule__header">
          <span className="schedule__script">Plan Your Visit</span>
          <h2 className="schedule__title">Schedule a Tour</h2>
          <p className="schedule__description">
            Experience the magic of Rum River Barn in person. Book your private tour today.
          </p>
        </div>

        <form className="schedule__form" onSubmit={handleSubmit}>
          <div className="schedule__row">
            <div className="schedule__group">
              <label htmlFor="name" className="schedule__label">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="schedule__input"
                placeholder="John & Jane Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="schedule__group">
              <label htmlFor="email" className="schedule__label">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="schedule__input"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="schedule__row">
            <div className="schedule__group">
              <label htmlFor="phone" className="schedule__label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="schedule__input"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="schedule__group">
              <label htmlFor="date" className="schedule__label">
                Preferred Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className="schedule__input"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="schedule__group">
            <label htmlFor="guests" className="schedule__label">
              Expected Guest Count
            </label>
            <select
              id="guests"
              name="guests"
              className="schedule__select"
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

          <div className="schedule__group">
            <label htmlFor="message" className="schedule__label">
              Tell Us About Your Vision
            </label>
            <textarea
              id="message"
              name="message"
              className="schedule__textarea"
              placeholder="Share your dream wedding details, special requests, or questions..."
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="schedule__submit">
            Schedule Your Tour
          </button>
        </form>
      </div>
    </section>
  );
}
