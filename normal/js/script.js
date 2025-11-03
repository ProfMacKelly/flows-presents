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
        element.style.height = 'auto';
        const contentHeight = element.scrollHeight;
        element.style.height = '0';
        requestAnimationFrame(() => {
          element.style.height = contentHeight + 'px';
        });
        element.addEventListener('transitionend', function handler() {
          element.style.height = 'auto';
          element.removeEventListener('transitionend', handler);
        });
      } else {
        element.style.height = element.scrollHeight + 'px';
        requestAnimationFrame(() => {
          element.style.height = '0';
        });
        element.addEventListener('transitionend', function handler() {
          element.classList.add('is-hidden');
          element.removeEventListener('transitionend', handler);
        });
      }
    }

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.answer-header').forEach(header => {
    header.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target');
      const content = document.getElementById(targetId);
      const arrow = this.querySelector('.answer-arrow i');

      const isHidden = content.classList.contains('is-hidden');
      this.classList.toggle('is-open');

      if (isHidden) {
        content.classList.remove('is-hidden');
        slideToggleContent(content, true);
        if (arrow) {
          arrow.classList.remove('fa-angle-right');
          arrow.classList.add('fa-angle-down');
        }
      } else {
        slideToggleContent(content, false);
        if (arrow) {
          arrow.classList.remove('fa-angle-down');
          arrow.classList.add('fa-angle-right');
        }
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.attrib-header').forEach(header => {
    header.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target');
      const content = document.getElementById(targetId);
      const arrow = this.querySelector('.attrib-arrow i');

      const isHidden = content.classList.contains('is-hidden');
      this.classList.toggle('is-open');

      if (isHidden) {
        content.classList.remove('is-hidden');
        slideToggleContent(content, true);
        if (arrow) {
          arrow.classList.remove('fa-angle-right');
          arrow.classList.add('fa-angle-down');
        }
      } else {
        slideToggleContent(content, false);
        if (arrow) {
          arrow.classList.remove('fa-angle-down');
          arrow.classList.add('fa-angle-right');
        }
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.editorial-header').forEach(header => {
    header.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target');
      const content = document.getElementById(targetId);
      const arrow = this.querySelector('.editorial-arrow i');

      const isHidden = content.classList.contains('is-hidden');
      this.classList.toggle('is-open');

      if (isHidden) {
        content.classList.remove('is-hidden');
        slideToggleContent(content, true);
        if (arrow) {
          arrow.classList.remove('fa-angle-right');
          arrow.classList.add('fa-angle-down');
        }
      } else {
        slideToggleContent(content, false);
        if (arrow) {
          arrow.classList.remove('fa-angle-down');
          arrow.classList.add('fa-angle-right');
        }
      }
    });
  });
});
