// ==============================
// Hotfix Route Group Layout
// Only loads hotfix CSS for routes under this group
// ==============================
import '@/styles/hotfix/design-tokens.css';
import '@/styles/hotfix/animations.css';
import '@/styles/hotfix/icon-system.css';
import '@/styles/hotfix/navbar-styles.css';
import '@/styles/hotfix/theme-toggle-styles.css';
import '@/styles/hotfix/hero-styles.css';
import '@/styles/hotfix/alternating-blocks-styles.css';
import '@/styles/hotfix/rum-river-experience-styles.css';
import '@/styles/hotfix/love-stories-gallery-styles.css';
import '@/styles/hotfix/brand-social-proof-styles.css';
import '@/styles/hotfix/testimonials-styles.css';
import '@/styles/hotfix/history-carousel-styles.css';
import '@/styles/hotfix/schedule-form-styles.css';
import '@/styles/hotfix/map-section-styles.css';
import '@/styles/hotfix/faq-accordion-styles.css';
import '@/styles/hotfix/pricing-styles.css';
import '@/styles/hotfix/footer-styles.css';
import '@/styles/hotfix/spaces-styles.css';
import '@/styles/hotfix/media-darken.css';
import '@/styles/hotfix/tokens-dark.css';

export default function HotfixLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
