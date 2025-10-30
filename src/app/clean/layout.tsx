/**
 * Clean Version Layout
 * Imports semantic CSS files and existing design tokens
 */

import '@/app/globals.css';
import '@/styles/hotfix/design-tokens.css'; // Reuse existing tokens
import '@/styles/hotfix/tokens-dark.css'; // Reuse tonal ladder tokens
import '@/styles/semantic/navbar.css';
import '@/styles/semantic/hero.css';

export default function CleanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
