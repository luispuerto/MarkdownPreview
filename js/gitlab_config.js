'use strict';

/*
  Copyright GitLab B.V.

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

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
