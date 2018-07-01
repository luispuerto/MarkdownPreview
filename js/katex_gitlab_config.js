(function () {
'use strict';

var katexMath = (function () {
    var maths = document.querySelectorAll('.js-render-math');
    for (var i = 0; i < maths.length; i++) {
      katex.render(maths[i].textContent || maths[i].innerText, maths[i], {'displayMode': false});
    }
});

(function () {
  var onReady = function onReady(fn) {
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      document.attachEvent("onreadystatechange", function () {
        if (document.readyState === "interactive") {
          fn();
        }
      });
    }
  };

  onReady(function () {
    if (typeof katex !== "undefined") {
      katexMath();
    }
  });
})();

}());
