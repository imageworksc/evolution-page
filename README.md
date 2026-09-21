# Website Support & Evolution

Landing page for the ImageWorks Creative *Website Support & Evolution* plans.

Live: https://imageworksc.github.io/evolution-page/

Built on the same design system as the [Custom Web Design](https://imageworksc.github.io/Custom-Web-Design/) page: Plus Jakarta Sans (self-hosted), the navy / blue / green brand tokens, 2px corners, the alternating light / tint / deep bands, and the closing gradient CTA.

## Files

- `index.html` — the page (semantic markup, JSON-LD, inline SVG sprite). No inline styles; every presentational hook is a class.
- `styles.css` — design tokens and every component, in the order the contents block at the top lists them; single light theme
- `app.js` — scroll reveals and the looping changelog; loaded in `<head>` so the hero entrance is gated on it
- `fonts/plus-jakarta-sans-latin.woff2` — variable font, weights 300–800

No build step. Open `index.html` directly or serve the folder.

## One layout from phones to 5K

Every length in the stylesheet is in `rem`, and the root size is

```css
html { font-size: max(100%, min(.8333vw, 1.4815vh)); }
```

Up to a 1920×1080 viewport that is the visitor's default 16px, so phones, tablets and laptops render the design at its drawn size. Past that the root grows with the smaller viewport dimension, so the page a full-HD monitor shows is drawn at 1.33× on QHD (2560×1440), exactly 2× on 4K (3840×2160) and 2.67× on 5K (5120×2880) — same composition, same proportions, sharper. Taking the smaller dimension keeps ultrawide screens from over-scaling by width.

Only three things stay in `px`: 1px hairlines, the 1px dots of the band patterns, and the media-query breakpoints (900 / 640 / 560 / 480 / 380 / 360), which are all collected in one section at the end of the stylesheet.
