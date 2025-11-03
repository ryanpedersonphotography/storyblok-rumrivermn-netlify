/* SCHEDULE TOUR FORM SECTION - Updated for Next.js Server Actions + Resend
 * Tour scheduling form with Server Actions integration
 * Dependencies: hotfix-site.css classes, Resend package
 */

import { submitTourRequest } from './actions'

export function ScheduleFormSection() {
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
    <section className="hotfix-schedule-tour">
      <div className="hotfix-form-container">
        <div className="hotfix-form-header">
          <p className="hotfix-form-script">Schedule Your Tour</p>
          <h2 className="hotfix-form-title">Start Planning Your Perfect Day</h2>
          <p className="hotfix-form-description">
            We'd love to show you around our beautiful venue and discuss your wedding vision.
          </p>
        </div>

        <form 
          action={submitTourRequest}
          className="hotfix-tour-form"
        >
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
            SCHEDULE TOUR
          </button>
        </form>
      </div>
    </section>
  );
}