/* ==========================================================================
   ImageWorks Creative — Website Support & Evolution
   Behaviour for the page. Three jobs, each its own function:
     1. setupReveals   — the scroll-triggered entrances (.reveal)
     2. setupTicker    — the looping changelog on the deep band
     3. setupCalendar  — the hero calendar checking its months off
   plus the one line that runs before the body is parsed (see below).
   Nothing here writes a style attribute: every state is a class.

   Loaded in <head> without defer on purpose: the hero's entrance hides its
   own content until it plays, and the flag that gates that hidden state must
   be on <html> before the first paint. Everything else waits for the DOM.
   ========================================================================== */
(function () {
  'use strict';

  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Set before the body is parsed. A page that never runs this line shows the
     hero outright instead of a blank band. */
  root.setAttribute('data-hero-anim', 'on');

  /* ------------------------------------------------------------------
     1. Entrance reveals. Each element is revealed once, and only when
     the browser supports IntersectionObserver and the visitor has not
     asked for reduced motion — otherwise everything is shown at once.
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
     2. The changelog loops. The list is doubled once so the second half
     can take over as the first scrolls out, and the keyframe travels
     exactly -50%. With reduced motion the list stands still as a
     scrollable strip, so it is left as a single copy.
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

  /* ------------------------------------------------------------------
     3. The hero calendar. The months are checked off one after another;
     when December is done the year holds for a moment, then the checks
     come off again in a quick reverse cascade and the run starts over.
     The count in the header and the segments of the track follow along.

     Pointing at the card holds the run where it is, and a hidden tab
     stops the clock so the page does not come back mid-burst. Under
     reduced motion the calendar is set once and left alone.
     ------------------------------------------------------------------ */
  function setupCalendar() {
    const cal = document.querySelector('[data-calendar]');
    if (!cal) return;

    const months = [...cal.querySelectorAll('.cal-m')];
    const count = cal.querySelector('[data-count]');
    const nowMonth = cal.querySelector('[data-now-month]');
    const nowPage = cal.querySelector('[data-now-page]');
    if (!months.length) return;

    const STEP = 1700;    // ms between one month and the next
    const HOLD = 3400;    // ms the full year stays on screen
    const REWIND = 70;    // ms between checks coming off
    const RESTART = 900;  // ms before the run begins again

    // the markup ships with the months already done, so the run starts there
    let done = months.filter((m) => m.classList.contains('is-done')).length;
    let rewinding = false;
    let timer = 0;
    let held = false;

    // Everything the card shows follows from `done`: the leaves' states, the
    // ring (read from data-done by the stylesheet), the count, and the header
    // line naming the month in hand and its page. While the year rewinds the
    // header keeps the closing line rather than flicking back through months.
    const paint = () => {
      months.forEach((m, i) => {
        m.classList.toggle('is-done', i < done);
        m.classList.toggle('is-now', !rewinding && i === done);
      });
      cal.dataset.done = String(done);
      if (count) count.textContent = String(done);

      const current = months[done];
      if (!nowMonth || !nowPage) return;
      if (current && !rewinding) {
        nowMonth.textContent = current.dataset.month ?? '';
        nowPage.textContent = current.dataset.page ?? '';
      } else if (done === months.length || rewinding) {
        nowMonth.textContent = 'Year complete';
        nowPage.textContent = 'Twelve pages improved';
      }
    };

    if (reduced.matches) {
      done = 3;
      paint();
      return;
    }

    const schedule = (ms) => { timer = window.setTimeout(step, ms); };

    const step = () => {
      if (rewinding) {
        done -= 1;
        paint();
        if (done === 0) {
          rewinding = false;
          paint();
          schedule(RESTART);
        } else {
          schedule(REWIND);
        }
        return;
      }
      done += 1;
      paint();
      if (done === months.length) {
        rewinding = true;
        schedule(HOLD);
      } else {
        schedule(STEP);
      }
    };

    const hold = () => { window.clearTimeout(timer); held = true; };
    const release = () => {
      if (!held) return;
      held = false;
      schedule(rewinding ? REWIND : STEP);
    };

    cal.addEventListener('mouseenter', hold);
    cal.addEventListener('mouseleave', release);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) hold();
      else if (!cal.matches(':hover')) release();
    });

    paint();
    schedule(STEP);
  }

  function init() {
    setupReveals();
    setupTicker();
    setupCalendar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
