/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block (CTA banner)
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: hero
 *
 * Source HTML Pattern:
 * <div class="utility-position-relative utility-radius-card utility-overflow-clip">
 *   <img src="..." class="cover-image utility-overlay">
 *   <div class="overlay utility-z-index-1"></div>
 *   <div class="card-body utility-max-width-lg utility-text-on-overlay">
 *     <h2 class="h1-heading">Heading</h2>
 *     <p class="subheading">Description</p>
 *     <div class="button-group">
 *       <a href="#" class="button inverse-button">CTA text</a>
 *     </div>
 *   </div>
 * </div>
 *
 * Block Structure:
 * - Row 1: Background image
 * - Row 2: Heading + description + CTA buttons
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  const cells = [];

  // Background image
  // EXTRACTED: <img ... class="cover-image utility-overlay"> as first child
  const bgImage = element.querySelector('img.cover-image, img.utility-overlay, :scope > img');
  if (bgImage) {
    const imgP = document.createElement('p');
    const picture = document.createElement('picture');
    const imgEl = document.createElement('img');
    imgEl.src = bgImage.src;
    imgEl.alt = bgImage.alt || '';
    picture.appendChild(imgEl);
    imgP.appendChild(picture);
    cells.push([imgP]);
  }

  // Content: heading + description + CTA buttons
  // EXTRACTED: Content inside <div class="card-body utility-max-width-lg utility-text-on-overlay">
  const contentCell = [];

  // Heading
  // EXTRACTED: <h2 class="h1-heading">Fresh looks, bold stories, real life</h2>
  const heading = element.querySelector('h2, h1, .h1-heading');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    contentCell.push(h2);
  }

  // Description
  // EXTRACTED: <p class="subheading">Dive into our latest case study...</p>
  const description = element.querySelector('p.subheading, .card-body > p');
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    contentCell.push(p);
  }

  // CTA buttons
  // EXTRACTED: <a href="#" class="button inverse-button">See more</a> inside .button-group
  const buttons = Array.from(element.querySelectorAll('.button-group a.button, a.button'));
  buttons.forEach((btn) => {
    const btnP = document.createElement('p');
    const strong = document.createElement('strong');
    const link = document.createElement('a');
    link.href = btn.href || '#';
    link.textContent = btn.textContent.trim();
    strong.appendChild(link);
    btnP.appendChild(strong);
    contentCell.push(btnP);
  });

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });
  element.replaceWith(block);
}
