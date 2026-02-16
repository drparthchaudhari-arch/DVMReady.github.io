/* Portal utilities - DVMReady */
;(function () {
  function initPortal() {
    // Portal initialization
    // Game-related functionality removed
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortal, { once: true })
  } else {
    initPortal()
  }

  window.pcPortal = {}
})()
