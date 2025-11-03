'use client';

import { useEffect } from 'react';

/**
 * Dialog + Form Field Primitives Demo Page
 * Demonstrates Dialog/Scrim and Form Field primitives with full a11y support
 */
export default function DialogDemo() {
  useEffect(() => {
    // Initialize dialog event listeners
    import('@/scripts/dialog').then(({ initDialogs }) => {
      initDialogs();
    });
  }, []);

  return (
    <main data-clean-root="true" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="stack" style={{ '--stack-gap': 'var(--space-32)' } as React.CSSProperties}>
        <header>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--space-16)' }}>
            Dialog + Form Field Primitives Demo
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', maxWidth: '65ch' }}>
            This page demonstrates the Dialog/Scrim and Form Field primitives with full accessibility support,
            container query awareness, and Phase 6 token integration.
          </p>
        </header>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-12)' }}>Dialog Primitive</h2>
          <p style={{ marginBottom: 'var(--space-16)', color: 'var(--text-muted)' }}>
            Click the button below to open a modal dialog with focus trap, ESC close, and outside-click close.
          </p>
          <button
            data-ui="button"
            data-variant="solid"
            data-size="md"
            data-corner="pill"
            data-dialog-open="contact"
          >
            Open Contact Dialog
          </button>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-12)' }}>Standalone Form Fields</h2>
          <div className="stack" style={{ '--stack-gap': 'var(--space-20)' } as React.CSSProperties}>
            {/* Stack layout field */}
            <div className="field" data-clean-root="true" data-size="md" data-layout="stack">
              <label htmlFor="demo-name" className="field__label">
                Your name <span className="field__required" aria-hidden="true">*</span>
              </label>
              <div className="field__control">
                <input
                  id="demo-name"
                  name="demo-name"
                  className="field__input"
                  required
                  aria-describedby="demo-name-hint"
                />
              </div>
              <p id="demo-name-hint" className="field__hint">
                This is a standard stack-layout field.
              </p>
            </div>

            {/* Inline layout field (switches at tablet-up) */}
            <div className="field" data-clean-root="true" data-size="md" data-layout="inline">
              <label htmlFor="demo-email" className="field__label">
                Email
              </label>
              <div className="field__control">
                <input
                  id="demo-email"
                  name="demo-email"
                  type="email"
                  className="field__input"
                  aria-describedby="demo-email-hint"
                />
              </div>
              <p id="demo-email-hint" className="field__hint">
                This field switches to inline layout at tablet-up (via container query).
              </p>
            </div>

            {/* Invalid state field */}
            <div className="field" data-clean-root="true" data-size="md" aria-invalid="true">
              <label htmlFor="demo-invalid" className="field__label">
                Invalid Example
              </label>
              <div className="field__control">
                <input
                  id="demo-invalid"
                  name="demo-invalid"
                  className="field__input"
                  aria-describedby="demo-invalid-err"
                  defaultValue="invalid@"
                />
              </div>
              <p id="demo-invalid-err" className="field__error">
                Please enter a valid email address.
              </p>
            </div>

            {/* Textarea */}
            <div className="field" data-clean-root="true" data-size="lg">
              <label htmlFor="demo-msg" className="field__label">
                Message
              </label>
              <div className="field__control">
                <textarea id="demo-msg" name="demo-msg" className="field__textarea" rows={5} />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* DIALOG MARKUP */}
      <div className="scrim" data-scrim-for="contact" />
      <div
        className="dialog"
        id="contact"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        aria-describedby="contact-desc"
      >
        <div className="dialog__panel" data-size="md" tabIndex={-1}>
          <header className="dialog__header">
            <h2 id="contact-title" className="dialog__title">
              Book a Tour
            </h2>
            <button
              className="dialog__close"
              aria-label="Close dialog"
              data-dialog-close="contact"
            >
              ×
            </button>
          </header>

          <div id="contact-desc" className="dialog__body">
            <div className="stack" style={{ '--stack-gap': 'var(--space-20)' } as React.CSSProperties}>
              {/* Name field */}
              <div className="field" data-clean-root="true" data-size="md" data-layout="stack">
                <label htmlFor="name" className="field__label">
                  Your name <span className="field__required" aria-hidden="true">*</span>
                </label>
                <div className="field__control">
                  <input
                    id="name"
                    name="name"
                    className="field__input"
                    required
                    aria-describedby="name-hint"
                  />
                </div>
                <p id="name-hint" className="field__hint">
                  We'll use this to address you in emails.
                </p>
              </div>

              {/* Email field with inline layout */}
              <div className="field" data-clean-root="true" data-size="md" data-layout="inline">
                <label htmlFor="email" className="field__label">
                  Email
                </label>
                <div className="field__control">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="field__input"
                    required
                  />
                </div>
              </div>

              {/* Phone field */}
              <div className="field" data-clean-root="true" data-size="md">
                <label htmlFor="phone" className="field__label">
                  Phone
                </label>
                <div className="field__control">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="field__input"
                    aria-describedby="phone-hint"
                  />
                </div>
                <p id="phone-hint" className="field__hint">Optional</p>
              </div>

              {/* Message field */}
              <div className="field" data-clean-root="true" data-size="lg">
                <label htmlFor="msg" className="field__label">
                  Message
                </label>
                <div className="field__control">
                  <textarea id="msg" name="msg" className="field__textarea" rows={5} />
                </div>
              </div>
            </div>
          </div>

          <footer className="dialog__footer">
            <button
              data-ui="button"
              data-variant="ghost"
              data-size="md"
              data-corner="pill"
              data-dialog-close="contact"
            >
              Cancel
            </button>
            <button
              data-ui="button"
              data-variant="solid"
              data-size="md"
              data-corner="pill"
            >
              Send Message
            </button>
          </footer>
        </div>
      </div>
    </main>
  );
}
