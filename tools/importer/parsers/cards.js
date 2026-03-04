/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block (article cards)
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: cards
 *
 * Source HTML Pattern:
 * <div class="grid-layout desktop-4-column">
 *   <a href="/blog/..." class="article-card card-link">
 *     <div class="article-card-image">
 *       <img src="..." alt="..." class="cover-image">
 *     </div>
 *     <div class="article-card-body">
 *       <div class="article-card-meta">
 *         <span class="tag">Category</span>
 *         <span class="paragraph-sm">Date</span>
 *       </div>
 *       <h3 class="h4-heading">Title</h3>
 *     </div>
 *   </a>
 * </div>
 *
 * Block Structure:
 * - Row N: [image] | [category · date + heading + link]
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  // EXTRACTED: Article cards are <a class="article-card card-link"> elements
  const cards = element.querySelectorAll('a.article-card, .article-card');

  const cells = [];

  cards.forEach((card) => {
    // Image column
    // EXTRACTED: <img ... class="cover-image"> inside .article-card-image
    const img = card.querySelector('.article-card-image img, img');

    // Text content column
    const contentElements = [];

    // Category tag + date
    // EXTRACTED: <span class="tag">Casual Cool</span> and <span class="paragraph-sm">May 12</span>
    const tag = card.querySelector('.tag, .article-card-meta span:first-child');
    const date = card.querySelector('.paragraph-sm, .article-card-meta span:last-child');
    if (tag || date) {
      const metaP = document.createElement('p');
      const parts = [];
      if (tag) parts.push(tag.textContent.trim());
      if (date) parts.push(date.textContent.trim());
      metaP.textContent = parts.join(' \u00B7 ');
      contentElements.push(metaP);
    }

    // Title
    // EXTRACTED: <h3 class="h4-heading">Tennis style, redefined</h3>
    const heading = card.querySelector('h3, .h4-heading');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      contentElements.push(h3);
    }

    // Read more link
    // EXTRACTED: The entire card is an <a> with href="/blog/..."
    const href = card.getAttribute('href') || card.querySelector('a')?.getAttribute('href');
    if (href) {
      const linkP = document.createElement('p');
      const link = document.createElement('a');
      link.href = href;
      link.textContent = 'Read more';
      linkP.appendChild(link);
      contentElements.push(linkP);
    }

    const imageCell = img ? [img] : [];
    cells.push([imageCell, contentElements]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
  element.replaceWith(block);
}
