'use strict';

mermaid.initialize({
  // mermaid core options
  mermaid: {
    startOnLoad: false,
  },
  // mermaidAPI options
  theme: 'neutral',
});

// Loop over all math elements and render math
function renderWithKaTeX(elements, katex) {
  elements.each(function katexElementsLoop() {
    const mathNode = $('<span></span>');
    const $this = $(this);

    const display = $this.attr('data-math-style') === 'display';
    try {
      katex.render($this.text(), mathNode.get(0), { displayMode: display, throwOnError: false });
      mathNode.insertAfter($this);
      $this.remove();
    } catch (err) {
      throw err;
    }
  });
}

function renderMath($els) {
  if (!$els.length) return;
  renderWithKaTeX($els, katex);
}

function syntaxHighlight(el) {
  if ($(el).hasClass('js-syntax-highlight')) {
    // Given the element itself, apply highlighting
    return $(el).addClass(HIGHLIGHT_THEME);
  } else {
    // Given a parent element, recurse to any of its applicable children
    const $children = $(el).find('.js-syntax-highlight');
    if ($children.length) {
      return syntaxHighlight($children);
    }
  }
}

function renderMermaid($els) {
  if (!$els.length) return;
  $els.each((i, el) => {
    const source = el.textContent;

    // Remove any extra spans added by the backend syntax highlighting.
    Object.assign(el, { textContent: source });

    mermaid.init(undefined, el, (id) => {
      const svg = document.getElementById(id);

      svg.classList.add('mermaid');

      // pre > code > svg
      svg.closest('pre').replaceWith(svg);

      // We need to add the original source into the DOM to allow Copy-as-GFM
      // to access it.
      const sourceEl = document.createElement('text');
      sourceEl.classList.add('source');
      sourceEl.setAttribute('display', 'none');
      sourceEl.textContent = source;

      svg.appendChild(sourceEl);
    });
  });
}


$.fn.renderGFM = function renderGFM() {
  syntaxHighlight(this.find('.js-syntax-highlight'));
  renderMath(this.find('.js-render-math'));
  renderMermaid(this.find('.js-render-mermaid'));
  return this;
};

$(() => $('body').renderGFM());
