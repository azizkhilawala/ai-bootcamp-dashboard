/**
 * Accessibility helper functions
 */

interface PageMetadata {
  title: string;
  description?: string;
}

/**
 * Updates the page title with proper formatting
 */
export const setPageTitle = (title: string): void => {
  document.title = `${title} - AI Bootcamp Dashboard`;
};

/**
 * Updates the page meta description
 */
export const setPageDescription = (description: string): void => {
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  }
};

/**
 * Updates both page title and description
 */
export const setPageMetadata = ({ title, description }: PageMetadata): void => {
  setPageTitle(title);
  if (description) {
    setPageDescription(description);
  }
};

/**
 * Announces a message to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'alert');
  announcement.setAttribute('aria-live', priority);
  announcement.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
}; 