# Website Support & Evolution

Landing page for the ImageWorks Creative *Website Support & Evolution* plans.

Live: https://imageworksc.github.io/evolution-page/

Built on the same design system as the [Custom Web Design](https://imageworksc.github.io/Custom-Web-Design/) page: Plus Jakarta Sans (self-hosted), the navy / blue / green brand tokens, 2px corners, the alternating light / tint / deep bands, and the closing gradient CTA.

## Files

- `index.html` — the page (semantic markup, JSON-LD, inline SVG sprite)
- `styles.css` — design tokens and every component; single light theme
- `app.js` — scroll reveals and the looping changelog; loaded in `<head>` so the hero entrance is gated on it
- `fonts/plus-jakarta-sans-latin.woff2` — variable font, weights 300–800

No build step. Open `index.html` directly or serve the folder.
