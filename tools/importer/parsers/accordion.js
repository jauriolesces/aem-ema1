/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion block (FAQ)
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: accordion
 *
 * Source HTML Pattern:
 * <div class="faq-list">
 *   <details class="faq-item">
 *     <summary class="faq-question">
 *       <span>Question text</span>
 *       <img ...>  (expand/collapse icon)
 *     </summary>
 *     <div class="faq-answer">
 *       <p>Answer text</p>
 *     </div>
 *   </details>
 * </div>
 *
 * Block Structure:
 * - Row N: [question] | [answer]
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  // EXTRACTED: FAQ items are <details class="faq-item"> elements
  const items = element.querySelectorAll('details.faq-item, details');

  const cells = [];

  items.forEach((item) => {
    // Question text
    // EXTRACTED: <summary class="faq-question"><span>Question text</span></summary>
    const summarySpan = item.querySelector('summary span');
    const summaryEl = item.querySelector('summary');
    const questionText = summarySpan?.textContent?.trim()
      || summaryEl?.textContent?.trim()
      || '';

    const questionP = document.createElement('p');
    questionP.textContent = questionText;

    // Answer text
    // EXTRACTED: <div class="faq-answer"><p>Answer text</p></div>
    const answerDiv = item.querySelector('.faq-answer');
    const answerP = answerDiv?.querySelector('p');

    let answerElement;
    if (answerP) {
      const p = document.createElement('p');
      p.textContent = answerP.textContent.trim();
      answerElement = p;
    } else if (answerDiv) {
      const p = document.createElement('p');
      p.textContent = answerDiv.textContent.trim();
      answerElement = p;
    } else {
      answerElement = document.createElement('p');
    }

    cells.push([
      [questionP],
      [answerElement],
    ]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion', cells });
  element.replaceWith(block);
}
