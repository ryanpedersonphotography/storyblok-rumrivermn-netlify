/**
 * Clean Version Layout
 * Imports only semantic CSS files (tokens already loaded by root layout)
 */

import '@/styles/semantic/navbar.css';
import '@/styles/semantic/hero.css';

export default function CleanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
