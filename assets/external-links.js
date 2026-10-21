/* Open links that leave the site in a new tab.
 *
 * Scope: page content only (.md-content), so the theme header, nav and footer
 * keep their default behaviour. Internal links stay in the same tab; they are
 * the site's navigation and must keep the Back button working.
 *
 * Each external link gets:
 *  - target="_blank" rel="noopener noreferrer"
 *  - a visible arrow marker (aria-hidden, decorative)
 *  - hidden text "(opens in new tab)" for screen readers (WCAG G201)
 */
(function () {
  function mark(root) {
    root.querySelectorAll(".md-content a[href]").forEach(function (a) {
      if (a.dataset.ext) return; // already processed
      if (!/^https?:$/.test(a.protocol)) return; // skip mailto:, tel:, etc.
      if (a.host === window.location.host) return; // internal link
      a.dataset.ext = "1";
      a.target = "_blank";
      a.rel = "noopener noreferrer";

      var arrow = document.createElement("span");
      arrow.className = "ext-mark";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "\u2197"; // ↗

      var hint = document.createElement("span");
      hint.className = "ext-sr";
      hint.textContent = " (opens in new tab)";

      a.append(arrow, hint);
    });
  }

  function run() { mark(document); }

  // Material exposes document$ and emits on every page load, including
  // instant navigation if it is enabled later. Fall back to DOMContentLoaded.
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(run);
  } else if (document.readyState !== "loading") {
    run();
  } else {
    document.addEventListener("DOMContentLoaded", run);
  }
})();
