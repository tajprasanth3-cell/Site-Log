/**
 * Universal Scroll-to-Top utility for SiteLog
 * Resets window, document, and layout container scroll positions to the top.
 */
export const scrollToTop = (smooth = false): void => {
  if (typeof window === 'undefined') return;

  const behavior: ScrollBehavior = smooth ? 'smooth' : 'instant';

  try {
    window.scrollTo({ top: 0, left: 0, behavior });
  } catch {
    window.scrollTo(0, 0);
  }

  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
  }
  if (document.body) {
    document.body.scrollTop = 0;
  }

  const mainWrapper = document.querySelector('.main-wrapper');
  if (mainWrapper) {
    mainWrapper.scrollTop = 0;
  }

  const mainEl = document.querySelector('main');
  if (mainEl) {
    mainEl.scrollTop = 0;
  }

  const pageContent = document.querySelector('.page-content');
  if (pageContent) {
    pageContent.scrollTop = 0;
  }

  const appContainer = document.querySelector('.app-container');
  if (appContainer) {
    appContainer.scrollTop = 0;
  }
};
