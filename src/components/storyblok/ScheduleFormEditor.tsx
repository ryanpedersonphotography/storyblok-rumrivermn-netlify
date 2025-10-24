'use client';

import { storyblokEditable } from '@storyblok/react/rsc';

interface ScheduleFormProps {
  blok: {
    _uid: string;
    component: string;
    script_accent?: string;
    section_title?: string;
    lead_text?: string;
    form_name?: string;
    thank_you_url?: string;
    submit_button_text?: string;
    [key: string]: any;
  };
}

export default function ScheduleFormEditor({ blok }: ScheduleFormProps) {
  const timeOptions = [
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM"
  ];

  const guestCountOptions = [
    { value: "50-100", label: "50-100 Guests" },
    { value: "100-150", label: "100-150 Guests" },
    { value: "150-200", label: "150-200 Guests" },
    { value: "200+", label: "200+ Guests" }
  ];

  return (
    <section
      className="hotfix-schedule-tour"
      {...storyblokEditable(blok)}
      data-discover="true"
    >
      <div className="hotfix-form-container">
        <div className="hotfix-form-header">
          <p className="hotfix-form-script">
            {blok.script_accent || 'Schedule Your Tour'}
          </p>
          <h2 className="hotfix-form-title">
            {blok.section_title || 'Start Planning Your Perfect Day'}
          </h2>
          <p className="hotfix-form-description">
            {blok.lead_text || "We'd love to show you around our beautiful venue and discuss your wedding vision."}
          </p>
        </div>

        <form
          className="hotfix-tour-form"
          name={blok.form_name || 'schedule-tour'}
          method="POST"
          data-netlify="true"
          action={blok.thank_you_url || '/thank-you'}
        >
          <input type="hidden" name="form-name" value={blok.form_name || 'schedule-tour'} />

          <div className="hotfix-form-group">
            <label htmlFor="name" className="hotfix-form-label">Your Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="hotfix-form-input"
              placeholder="John & Sarah"
            />
          </div>

          <div className="hotfix-form-row">
            <div className="hotfix-form-group">
              <label htmlFor="email" className="hotfix-form-label">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="hotfix-form-input"
                placeholder="your@email.com"
              />
            </div>
            <div className="hotfix-form-group">
              <label htmlFor="phone" className="hotfix-form-label">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="hotfix-form-input"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="hotfix-form-row">
            <div className="hotfix-form-group">
              <label htmlFor="proposedEventDate" className="hotfix-form-label">Proposed Event Date</label>
              <input
                type="date"
                id="proposedEventDate"
                name="proposedEventDate"
                className="hotfix-form-input"
              />
            </div>
            <div className="hotfix-form-group">
              <label htmlFor="preferredTourDate" className="hotfix-form-label">Preferred Tour Date *</label>
              <input
                type="date"
                id="preferredTourDate"
                name="preferredTourDate"
                required
                className="hotfix-form-input"
              />
            </div>
          </div>

          <div className="hotfix-form-row">
            <div className="hotfix-form-group">
              <label htmlFor="preferredTourTime" className="hotfix-form-label">Preferred Tour Time</label>
              <select
                id="preferredTourTime"
                name="preferredTourTime"
                className="hotfix-form-select"
              >
                <option value="">Select Time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div className="hotfix-form-group">
              <label htmlFor="guestCount" className="hotfix-form-label">Estimated Guest Count</label>
              <select
                id="guestCount"
                name="guestCount"
                className="hotfix-form-select"
              >
                <option value="">Select Range</option>
                {guestCountOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="hotfix-form-group">
            <label htmlFor="message" className="hotfix-form-label">Additional Information or Questions</label>
            <textarea
              id="message"
              name="message"
              className="hotfix-form-textarea"
              placeholder="Tell us about your event plans or any specific questions..."
              rows={4}
            />
          </div>

          <button type="submit" className="hotfix-form-submit">
            {blok.submit_button_text || 'SCHEDULE TOUR'}
          </button>
        </form>
      </div>
    </section>
  );
}
