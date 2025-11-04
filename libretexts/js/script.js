/* ============================================================
ELIDE FUNCTIONALITY
============================================================ */
function makeElideNode(innerNodes) {
const wrapper = document.createElement(&quot;span&quot;);
wrapper.className = &quot;elide-wrapper&quot;;

const ellipsis = document.createElement(&quot;button&quot;);
ellipsis.type = &quot;button&quot;;
ellipsis.className = &quot;elide-ellipsis&quot;;
ellipsis.setAttribute(&quot;aria-expanded&quot;, &quot;false&quot;);
ellipsis.innerHTML = '[&lt;strong class=&quot;elide-dots&quot;&gt;&hellip;&lt;/strong&gt;]';

const content = document.createElement(&quot;span&quot;);
content.className = &quot;elide-content&quot;;
content.setAttribute(&quot;hidden&quot;, &quot;&quot;);

const hideBtn = document.createElement(&quot;button&quot;);
hideBtn.type = &quot;button&quot;;
hideBtn.className = &quot;hide-btn&quot;;
hideBtn.innerHTML = '[&lt;span class=&quot;hide-word&quot;&gt;hide&lt;/span&gt;]';

innerNodes.forEach((n) =&gt; content.appendChild(n));
content.appendChild(hideBtn);

ellipsis.addEventListener(&quot;click&quot;, () =&gt; {
const expanded = ellipsis.getAttribute(&quot;aria-expanded&quot;) === &quot;true&quot;;
if (expanded) {
content.setAttribute(&quot;hidden&quot;, &quot;&quot;);
ellipsis.setAttribute(&quot;aria-expanded&quot;, &quot;false&quot;);
} else {
content.removeAttribute(&quot;hidden&quot;);
ellipsis.setAttribute(&quot;aria-expanded&quot;, &quot;true&quot;);
}
});

hideBtn.addEventListener(&quot;click&quot;, () =&gt; {
content.setAttribute(&quot;hidden&quot;, &quot;&quot;);
ellipsis.setAttribute(&quot;aria-expanded&quot;, &quot;false&quot;);
ellipsis.focus();
});

wrapper.appendChild(ellipsis);
wrapper.appendChild(content);
return wrapper;
}

function enhanceElides(root = document) {
const els = root.querySelectorAll(&quot;.elide&quot;);
els.forEach((el) =&gt; {
if (el.dataset.enhanced === &quot;true&quot;) return;
el.dataset.enhanced = &quot;true&quot;;
const nodes = Array.from(el.childNodes).map((n) =&gt; n.cloneNode(true));
const newNode = makeElideNode(nodes);
el.replaceWith(newNode);
});
}

document.addEventListener(&quot;DOMContentLoaded&quot;, () =&gt; enhanceElides());

/* ============================================================
COLLAPSIBLE BOXES
============================================================ */
var coll = document.getElementsByClassName(&quot;collapsible&quot;);
var i;

for (i = 0; i &lt; coll.length; i++) {
coll[i].addEventListener(&quot;click&quot;, function () {
this.classList.toggle(&quot;active&quot;);
var content = this.nextElementSibling;
if (content.style.maxHeight) {
content.style.maxHeight = null;
} else {
content.style.maxHeight = content.scrollHeight + &quot;px&quot;;
}
});
}

/* ============================================================
SLIDE TOGGLE ANIMATION
============================================================ */
/**
* Toggles the content with a smooth slide-down/slide-up transition.
* @param {HTMLElement} element The content element to slide.
* @param {boolean} isOpening True if the content should open (slide down).
*/
function slideToggleContent(element, isOpening) {
if (isOpening) {
element.style.height = &quot;auto&quot;;
const contentHeight = element.scrollHeight;
element.style.height = &quot;0&quot;;
requestAnimationFrame(() =&gt; {
element.style.height = contentHeight + &quot;px&quot;;
});
element.addEventListener(&quot;transitionend&quot;, function handler() {
element.style.height = &quot;auto&quot;;
element.removeEventListener(&quot;transitionend&quot;, handler);
});
} else {
element.style.height = element.scrollHeight + &quot;px&quot;;
requestAnimationFrame(() =&gt; {
element.style.height = &quot;0&quot;;
});
element.addEventListener(&quot;transitionend&quot;, function handler() {
element.classList.add(&quot;is-hidden&quot;);
element.removeEventListener(&quot;transitionend&quot;, handler);
});
}
}

/* ============================================================
ANSWER EXPANDABLES
============================================================ */
document.addEventListener(&quot;DOMContentLoaded&quot;, () =&gt; {
document.querySelectorAll(&quot;.answer-header&quot;).forEach((header) =&gt; {
header.addEventListener(&quot;click&quot;, function () {
const targetId = this.getAttribute(&quot;data-target&quot;);
const content = document.getElementById(targetId);

const isHidden = content.classList.contains(&quot;is-hidden&quot;);

// Toggle the &quot;is-open&quot; class for rotation animation
this.classList.toggle(&quot;is-open&quot;, isHidden);

if (isHidden) {
content.classList.remove(&quot;is-hidden&quot;);
slideToggleContent(content, true);
} else {
slideToggleContent(content, false);
this.classList.remove(&quot;is-open&quot;);
}
});
});
});

/* ============================================================
ATTRIBUTION EXPANDABLES
============================================================ */
document.addEventListener(&quot;DOMContentLoaded&quot;, () =&gt; {
document.querySelectorAll(&quot;.expand_notes-header&quot;).forEach((header) =&gt; {
header.addEventListener(&quot;click&quot;, function () {
const targetId = this.getAttribute(&quot;data-target&quot;);
const content = document.getElementById(targetId);

const isHidden = content.classList.contains(&quot;is-hidden&quot;);

// Toggle the &quot;is-open&quot; class for rotation animation
this.classList.toggle(&quot;is-open&quot;, isHidden);

if (isHidden) {
content.classList.remove(&quot;is-hidden&quot;);
slideToggleContent(content, true);
} else {
slideToggleContent(content, false);
this.classList.remove(&quot;is-open&quot;);
}
});
});
});