// ==========================================================================
// FILE: src/scripts/dialog.js
// Purpose: Vanilla JS dialog controller with accessibility features
// ==========================================================================
// Features:
// - Focus trap: Tab cycling within panel
// - ESC key: Close dialog
// - Outside-click: Close when clicking scrim
// - Scroll-lock: Prevent body scroll when dialog open
// - Return focus: Restore focus to opener when closed
//
// Usage:
//   import { initDialogs } from './scripts/dialog.js';
//   initDialogs();
//
// HTML:
//   <button data-dialog-open="my-dialog">Open</button>
//   <div class="scrim" data-scrim-for="my-dialog"></div>
//   <div class="dialog" id="my-dialog" role="dialog" aria-modal="true">
//     <div class="dialog__panel" tabindex="-1">
//       <button data-dialog-close="my-dialog">Close</button>
//     </div>
//   </div>
// ==========================================================================

/**
 * Get all focusable elements within a node
 * @param {HTMLElement} node - Parent element to search within
 * @returns {NodeListOf<HTMLElement>} Focusable elements
 */
function getFocusable(node) {
  return node.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
}

/**
 * Open a dialog by ID
 * @param {string} id - Dialog element ID
 */
function openDialog(id) {
  const dialog = document.getElementById(id);
  if (!dialog) return;

  const scrim = document.querySelector(`.scrim[data-scrim-for="${id}"]`);
  dialog.setAttribute('data-open', 'true');
  if (scrim) scrim.setAttribute('data-open', 'true');

  // Enable scroll lock
  document.documentElement.setAttribute('data-modal-open', 'true');

  // Setup focus trap
  const panel = dialog.querySelector('.dialog__panel');
  const focusables = getFocusable(panel);
  const first = focusables[0] || panel;
  const last = focusables[focusables.length - 1] || panel;

  // Keyboard handler: ESC closes, Tab cycles
  const onKeydown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeDialog(id);
    }
    if (e.key === 'Tab') {
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  // Outside-click handler: Click scrim to close
  const onClickOutside = (e) => {
    if (e.target === scrim) closeDialog(id);
  };

  // Store handlers for cleanup
  panel.__dialogHandlers = { onKeydown, onClickOutside };
  document.addEventListener('keydown', onKeydown);
  if (scrim) scrim.addEventListener('click', onClickOutside);

  // Move focus to first focusable element (or panel if none)
  (first || panel).focus();
}

/**
 * Close a dialog by ID
 * @param {string} id - Dialog element ID
 */
function closeDialog(id) {
  const dialog = document.getElementById(id);
  if (!dialog) return;

  const scrim = document.querySelector(`.scrim[data-scrim-for="${id}"]`);
  dialog.removeAttribute('data-open');
  if (scrim) scrim.removeAttribute('data-open');

  // Cleanup handlers
  const panel = dialog.querySelector('.dialog__panel');
  if (panel?.__dialogHandlers) {
    const { onKeydown, onClickOutside } = panel.__dialogHandlers;
    document.removeEventListener('keydown', onKeydown);
    if (scrim) scrim.removeEventListener('click', onClickOutside);
    delete panel.__dialogHandlers;
  }

  // Restore scroll if no other dialogs are open
  if (!document.querySelector('.dialog[data-open="true"]')) {
    document.documentElement.removeAttribute('data-modal-open');
  }

  // Return focus to opener
  const opener = document.querySelector(`[data-dialog-open="${id}"]`);
  if (opener) opener.focus();
}

/**
 * Initialize dialog event listeners on a root element
 * @param {HTMLElement|Document} root - Root element to attach listeners to
 */
export function initDialogs(root = document) {
  // Delegate open/close clicks
  root.addEventListener('click', (e) => {
    // Open button
    const openBtn = e.target.closest('[data-dialog-open]');
    if (openBtn) {
      const id = openBtn.getAttribute('data-dialog-open');
      if (id) {
        e.preventDefault();
        openDialog(id);
      }
    }

    // Close button
    const closeBtn = e.target.closest('[data-dialog-close]');
    if (closeBtn) {
      const id = closeBtn.getAttribute('data-dialog-close');
      if (id) {
        e.preventDefault();
        closeDialog(id);
      }
    }
  });
}

// Export individual functions for programmatic use
export { openDialog, closeDialog };
