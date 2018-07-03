'use strict';

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

$.fn.renderGFM = function renderGFM() {
  syntaxHighlight(this.find('.js-syntax-highlight'));
  renderMath(this.find('.js-render-math'));
  return this;
};

$(() => $('body').renderGFM());
