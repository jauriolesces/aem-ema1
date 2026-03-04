/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: columns
 *
 * Handles 3 layout types found on the page:
 * 1. Hero: 2-column layout (text + image grid) - selector: header .grid-layout
 * 2. Article Intro: 2-column layout (image + text) - selector: section .grid-layout.grid-gap-lg
 * 3. Photo Gallery: 4-column image grid (2 rows of 4) - selector: .grid-layout.desktop-4-column
 *
 * Block Structure:
 * - Row N: [col1] | [col2] | ... | [colN]
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect 4-column grid layout (photo gallery)
  // EXTRACTED: Found class="grid-layout desktop-4-column" on gallery section in captured DOM
  const is4Column = element.classList.contains('desktop-4-column');

  if (is4Column) {
    // Gallery layout: group child items into rows of 4
    // EXTRACTED: Children are <div class="utility-aspect-1x1"><img ...></div>
    const items = Array.from(element.querySelectorAll(':scope > div'));
    const columnsPerRow = 4;
    for (let i = 0; i < items.length; i += columnsPerRow) {
      const chunk = items.slice(i, i + columnsPerRow);
      const row = chunk.map((item) => {
        const img = item.querySelector('img');
        return img ? [img] : [item];
      });
      cells.push(row);
    }
  } else {
    // Standard multi-column layout: each direct child div becomes a column
    // EXTRACTED: Hero has 2 child divs (text content + image grid)
    // EXTRACTED: Article Intro has 2 child divs (image + text content)
    const children = Array.from(element.querySelectorAll(':scope > div'));
    if (children.length >= 2) {
      cells.push(children.map((child) => [child]));
    } else if (children.length === 1) {
      cells.push([[children[0]]]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
  element.replaceWith(block);
}
