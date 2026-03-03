/**
 * Scroll-triggered animations using IntersectionObserver
 * Respects prefers-reduced-motion and provides once-per-session behavior
 */

const STORAGE_KEY = 'portfolio-animated-sections';

function getAnimatedSections(): Set<string> {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveAnimatedSection(id: string): void {
  try {
    const sections = getAnimatedSections();
    sections.add(id);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...sections]));
  } catch {
    // Silently fail if sessionStorage is not available
  }
}

function initScrollAnimations(): void {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show all elements instantly
    document.querySelectorAll('[data-animate]').forEach((el) => {
      el.classList.add('animated');
    });
    return;
  }

  const animatedSections = getAnimatedSections();
  const elements = document.querySelectorAll('[data-animate]');

  // If page was already visited, show elements that were previously animated
  elements.forEach((el) => {
    const section = el.closest('section');
    const sectionId = section?.id;
    if (sectionId && animatedSections.has(sectionId)) {
      el.classList.add('animated');
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.classList.add('animated');

          // Track the section as animated
          const section = el.closest('section');
          if (section?.id) {
            saveAnimatedSection(section.id);
          }

          // Stop observing once animated
          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  // Observe all elements with data-animate attribute
  elements.forEach((el) => {
    // Skip if already animated (from session storage)
    if (!el.classList.contains('animated')) {
      observer.observe(el);
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}

