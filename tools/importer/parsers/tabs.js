/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs block (testimonials)
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: tabs
 *
 * Source HTML Pattern:
 * <div class="tabs-wrapper">
 *   <div class="tabs-content">
 *     <div class="tab-pane" id="tabpanel-N">
 *       <div class="grid-layout">
 *         <div><img ...></div>
 *         <div>
 *           <div><div><strong>Name</strong></div><div>Role</div></div>
 *           <p class="paragraph-xl">"Quote..."</p>
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 *   <div class="tab-menu">
 *     <button class="tab-menu-link"><strong>Name</strong>...</button>
 *   </div>
 * </div>
 *
 * Block Structure:
 * - Row N: [tab label] | [image + name (bold) + role + quote]
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  // EXTRACTED: Tab panes at .tab-pane with id="tabpanel-N"
  const tabPanes = element.querySelectorAll('.tab-pane');
  // EXTRACTED: Tab buttons at button.tab-menu-link with id="tab-N"
  const tabButtons = element.querySelectorAll('button.tab-menu-link');

  const cells = [];

  tabPanes.forEach((pane, i) => {
    // Extract tab label from button
    const button = tabButtons[i];
    const labelText = button?.querySelector('strong')?.textContent?.trim()
      || pane.querySelector('strong')?.textContent?.trim()
      || `Tab ${i + 1}`;

    const labelP = document.createElement('p');
    labelP.textContent = labelText;

    // Extract content from tab pane
    const contentElements = [];

    // Image
    // EXTRACTED: <img ... class="cover-image"> inside first grid child
    const img = pane.querySelector('img');
    if (img) {
      const imgP = document.createElement('p');
      const picture = document.createElement('picture');
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt || labelText;
      picture.appendChild(imgEl);
      imgP.appendChild(picture);
      contentElements.push(imgP);
    }

    // Name (bold)
    // EXTRACTED: <strong>Alex Rivera</strong> inside .paragraph-xl div
    const nameStrong = pane.querySelector('strong');
    if (nameStrong) {
      const nameP = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = nameStrong.textContent.trim();
      nameP.appendChild(strong);
      contentElements.push(nameP);
    }

    // Role text
    // EXTRACTED: Role is in a sibling div next to the name's parent div
    // Structure: div > [div.paragraph-xl(strong name), div(role text)]
    const nameParentDiv = nameStrong?.closest('div[class]')?.parentElement;
    if (nameParentDiv) {
      const innerDivs = nameParentDiv.querySelectorAll(':scope > div');
      if (innerDivs.length >= 2) {
        const roleText = innerDivs[1]?.textContent?.trim();
        if (roleText) {
          const roleP = document.createElement('p');
          roleP.textContent = roleText;
          contentElements.push(roleP);
        }
      }
    }

    // Quote
    // EXTRACTED: <p class="paragraph-xl">"Wearing new brands..."</p>
    const quote = pane.querySelector('p.paragraph-xl');
    if (quote) {
      const quoteP = document.createElement('p');
      quoteP.textContent = quote.textContent.trim();
      contentElements.push(quoteP);
    }

    cells.push([
      [labelP],
      contentElements,
    ]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs', cells });
  element.replaceWith(block);
}
