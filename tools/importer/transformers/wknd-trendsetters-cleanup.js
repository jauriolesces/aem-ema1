/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for WKND Trendsetters website cleanup
 * Purpose: Remove navigation, footer, skip links, and non-content elements
 * Applies to: wknd-trendsetters.site (all templates)
 * Generated: 2026-03-04
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (migration-work/cleaned.html)
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove skip-to-content link
    // EXTRACTED: Found <a href="#main-content" class="skip-link"> in captured DOM
    WebImporter.DOMUtils.remove(element, ['.skip-link']);

    // Remove navigation bar
    // EXTRACTED: Found <div class="navbar"> with full nav structure in captured DOM
    WebImporter.DOMUtils.remove(element, ['.navbar']);

    // Remove mobile menu toggle button
    // EXTRACTED: Found <button class="nav-mobile-menu-button" id="nav-toggle"> in captured DOM
    WebImporter.DOMUtils.remove(element, ['.nav-mobile-menu-button']);

    // Remove footer
    // EXTRACTED: Found <footer class="footer inverse-footer"> in captured DOM
    WebImporter.DOMUtils.remove(element, ['footer.footer']);

    // Remove inline SVG data URI images (nav icons, social icons, caret icons)
    // EXTRACTED: Multiple <img src="data:image/svg+xml;base64,..."> found across nav, footer, FAQ
    const dataUriImages = element.querySelectorAll('img[src^="data:image/svg+xml"]');
    dataUriImages.forEach((img) => img.remove());
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link',
      'source',
    ]);
  }
}
