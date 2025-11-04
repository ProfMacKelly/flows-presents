function makeElideNode(innerNodes) {
  const wrapper = document.createElement('span');
  wrapper.className = 'elide-wrapper';

  const ellipsis = document.createElement('button');
  ellipsis.type = 'button';
  ellipsis.className = 'elide-ellipsis';
  ellipsis.setAttribute('aria-expanded', 'false');
  ellipsis.innerHTML = '[<strong class="elide-dots">…</strong>]';

  const content = document.createElement('span');
  content.className = 'elide-content';
  content.setAttribute('hidden', '');

  const hideBtn = document.createElement('button');
  hideBtn.type = 'button';
  hideBtn.className = 'hide-btn';
  hideBtn.innerHTML = '[<span class="hide-word">hide</span>]';

  innerNodes.forEach(n => content.appendChild(n));
  content.appendChild(hideBtn);

  ellipsis.addEventListener('click', () => {
    const expanded = ellipsis.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      content.setAttribute('hidden', '');
      ellipsis.setAttribute('aria-expanded', 'false');
    } else {
      content.removeAttribute('hidden');
      ellipsis.setAttribute('aria-expanded', 'true');
    }
  });

  hideBtn.addEventListener('click', () => {
    content.setAttribute('hidden', '');
    ellipsis.setAttribute('aria-expanded', 'false');
    ellipsis.focus();
  });

  wrapper.appendChild(ellipsis);
  wrapper.appendChild(content);
  return wrapper;
}

function enhanceElides(root = document) {
  const els = root.querySelectorAll('.elide');
  els.forEach(el => {
    if (el.dataset.enhanced === 'true') return;
    el.dataset.enhanced = 'true';
    const nodes = Array.from(el.childNodes).map(n => n.cloneNode(true));
    const newNode = makeElideNode(nodes);
    el.replaceWith(newNode);
  });
}

document.addEventListener('DOMContentLoaded', () => enhanceElides());

var coll = document.getElementsByClassName('collapsible');
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener('click', function () {
    this.classList.toggle('active');
    var content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });
}
/**
 * Toggles the content with a smooth slide-down/slide-up transition.
 * @param {HTMLElement} element The content element to slide.
 * @param {boolean} isOpening True if the content should open (slide down).
 */
function slideToggleContent(element, isOpening) {
  if (isOpening) {
    // --- OPENING (Slide Down) ---

    // 1. Ensure the element is visible for height calculation
    element.style.height = 'auto';

    // 2. Get the natural height of the content (the actual height)
    const contentHeight = element.scrollHeight;

    // 3. Set height to 0 immediately (this happens too fast to see)
    element.style.height = '0';

    // 4. In the next animation frame, set the height to the actual content height
    // This triggers the CSS transition from 0 to contentHeight
    requestAnimationFrame(() => {
      element.style.height = contentHeight + 'px';
    });

    // 5. After the transition ends, clear the height so the content can be responsive again
    element.addEventListener('transitionend', function handler() {
      element.style.height = 'auto';
      element.removeEventListener('transitionend', handler);
    });
  } else {
    // --- CLOSING (Slide Up) ---

    // 1. Set the height explicitly to its current size (before changing it to 0)
    element.style.height = element.scrollHeight + 'px';

    // 2. In the next frame, set the height to 0.
    // This triggers the CSS transition from current size to 0
    requestAnimationFrame(() => {
      element.style.height = '0';
    });

    // 3. After the transition ends, re-apply the 'is-hidden' class
    element.addEventListener('transitionend', function handler() {
      element.classList.add('is-hidden');
      element.removeEventListener('transitionend', handler);
    });
  }
}

/**
 * Main toggle function called by the header click.
 */
function toggleCustomExpandable(headerId, contentId) {
  const header = document.getElementById(headerId);
  const content = document.getElementById(contentId);

  // Find the first <span> inside the header that serves as the icon
  const icon = header.querySelector("span[id$='arrow']");

  // Check if content is hidden
  const isCurrentlyHidden = content.classList.contains('is-hidden');

  // Toggle open state class
  header.classList.toggle('is-open');

  if (isCurrentlyHidden) {
    // Opening
    content.classList.remove('is-hidden');
    slideToggleContent(content, true);

    // Swap icon to minus
    if (icon) icon.textContent = '−';
  } else {
    // Closing
    slideToggleContent(content, false);

    // Once animation completes, swap icon back to plus
    if (icon) icon.textContent = '+';
  }
}
