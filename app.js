(function () {
  'use strict';

  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------
     Set before the body is parsed, which is why this file is loaded in
     the head rather than deferred. The hero's entrance hides its own
     content until it plays — gating the hidden state on this flag means
     a page that never runs this line shows the hero outright instead of
     a blank band.
     ------------------------------------------------------------------ */
  root.setAttribute('data-hero-anim', 'on');

  /* ------------------------------------------------------------------
     Entrance reveals. Only ever run once per element, and only when the
     browser both supports IntersectionObserver and the visitor has not
     asked for reduced motion.
     ------------------------------------------------------------------ */
  function setupReveals() {
    const targets = [...document.querySelectorAll('.reveal')];
    if (!targets.length) return;

    root.setAttribute('data-anim', 'on');

    if (reduced.matches || !('IntersectionObserver' in window)) {
      for (const el of targets) el.classList.add('is-revealed');
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    for (const el of targets) observer.observe(el);

    // The negative rootMargin means anything sitting in the last slice of a
    // fully-scrolled page would never trigger. Once the visitor reaches the
    // bottom, reveal whatever is still waiting.
    const revealRemainder = () => {
      const atBottom = window.innerHeight + window.scrollY >= root.scrollHeight - 2;
      if (!atBottom) return;
      for (const el of targets) {
        if (el.classList.contains('is-revealed')) continue;
        el.classList.add('is-revealed');
        observer.unobserve(el);
      }
      window.removeEventListener('scroll', revealRemainder);
    };

    window.addEventListener('scroll', revealRemainder, { passive: true });
    window.addEventListener('load', revealRemainder);
    revealRemainder();
  }

  /* ------------------------------------------------------------------
     The changelog loops. The list is doubled once so the second half can
     take over as the first scrolls out, and the keyframe travels exactly
     -50%. With reduced motion the list stands still as a scrollable
     strip, so it is left as a single copy.
     ------------------------------------------------------------------ */
  function setupTicker() {
    const list = document.getElementById('ticker');
    if (!list || list.dataset.looped || reduced.matches) return;

    for (const row of [...list.children]) {
      const copy = row.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      list.appendChild(copy);
    }
    list.dataset.looped = 'true';
  }

  function init() {
    setupReveals();
    setupTicker();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
