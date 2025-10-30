/**
 * Clean Version Layout
 * Imports only semantic CSS files (tokens already loaded by root layout)
 */

import '@/styles/semantic/navbar.css';
import '@/styles/semantic/hero.css';
import '@/styles/semantic/alternating-blocks.css';
import '@/styles/semantic/spaces.css';
import '@/styles/semantic/experience.css';
import '@/styles/semantic/gallery.css';
import '@/styles/semantic/brand-proof.css';
import '@/styles/semantic/testimonials.css';
import '@/styles/semantic/history-carousel.css';
import '@/styles/semantic/schedule-form.css';
import '@/styles/semantic/map.css';
import '@/styles/semantic/faq.css';
import '@/styles/semantic/pricing.css';
import '@/styles/semantic/footer.css';

export default function CleanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
