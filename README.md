# Amazon ADP Dark Mode TamperMonkey Script

A Tampermonkey userscript that applies an AWS Cloudscape-aligned dark theme to `https://my.adp.com` (Amazon employee ADP portal — Pay, Tax Statements, Tax Withholding, Wisely, Company).

## What This Repository Contains

- `amazon_adp_dark_mode.user.js` — the Tampermonkey userscript.
- `README.md` — installation and verification instructions.
- `ABOUT.md` — purpose, design principles, and architecture notes.

## Behavior Coverage

The script:

- forces a Cloudscape "Polaris Dark Mode" palette on the ADP shell, left rail, top header, content pane, and Pay summary cards
- preserves the full Cloudscape text hierarchy and brightens stat amounts (Take Home, Gross, Taxes) to emphasis text
- applies semantic alert tints (red error, blue info) and turns the privacy notice banner into an info-tinted banner
- styles tabs (Pay / Tax Statements / Tax Withholding) with Cloudscape muted-inactive and emphasis-selected with a `#42b4ff` underline
- styles the Featured Content tile grid, Pay donut surround, and breakdown table (Gross / Taxes / Take Home / Other Benefits)
- **leaves all SVG and canvas chart content untouched** so the green/red ADP donut chart segments render correctly
- runs a JS nuclear pass with luminance-based reclassification for ADP's frequent inline `style="color:#000"` and `background:#fff` patterns
- detects sticky/fixed top bars by position and forces them to `--bg-primary` (`#161d26`)
- pierces open shadow roots and re-applies the same stylesheet
- observes DOM mutations with a 250 ms debounce and runs delayed safety passes at 500 ms, 1500 ms, and 3000 ms after `load`

## Install on Chrome

1. Install Tampermonkey: <https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo>
2. Open the Tampermonkey dashboard and confirm it is enabled.
3. Open the raw userscript URL and let Tampermonkey prompt for install:
   `https://raw.githubusercontent.com/BarnsAWS/Amazon-ADP-Dark-Mode-TamperMonkey-Script/main/amazon_adp_dark_mode.user.js`
4. Click **Install**.
5. Visit `https://my.adp.com` and refresh once.

## Install on Firefox

1. Install Tampermonkey: <https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/>
2. Open the Tampermonkey dashboard.
3. Open the raw userscript URL above and click **Install**.
4. Visit `https://my.adp.com` and refresh once.

## Verification Checklist

- [ ] Page body and main content render on `#161d26`.
- [ ] Left navigation (Home / Pay / Wisely / Company) is dark with readable labels; the active page (Pay) shows a blue-tinted selected state.
- [ ] Top bar (amazon logo + Things To Do / ADP Assist / avatar) renders on `#161d26`.
- [ ] The privacy notice banner ("For your privacy, Hide My Pay is active...") renders with an info-blue tint, not bright white.
- [ ] Tabs (Pay / Tax Statements / Tax Withholding) — selected tab is bright white with a blue underline; inactive tabs are muted.
- [ ] My Pay summary card (Year selector, May 16 row, Gross/Take Home/Hours numbers) is on a `#1b232d` card surface.
- [ ] **The donut chart (green Take Home + red Taxes) keeps its original colors** — the script intentionally does not recolor SVG.
- [ ] The "Take Home $2,849.52" emphasis text is bright white.
- [ ] Breakdown table rows (Gross / Taxes / Take Home / Other Benefits) render on dark surfaces with readable amounts.
- [ ] Featured Content tiles (Training and Support cards with dates) are on `#1b232d` cards with bright headings and muted body copy.
- [ ] Links inside tiles are `#42b4ff` and lighten on hover.
- [ ] No bright white flash on initial load.

## Troubleshooting

- **Bright sections after load** — hard refresh (Ctrl+F5) and confirm Tampermonkey is enabled for `my.adp.com`.
- **Donut chart looks washed out or wrong color** — SVG and canvas are excluded from recolor by design; if the chart still looks off, your browser may be applying a separate site filter. Disable any "force dark" browser flag on this site.
- **Some hidden Pay amount values still appear light** — ADP's "Hide My Pay" feature uses a CSS blur on placeholder values; the script does not alter the blur. Toggle Hide My Pay off and refresh.
- **Statement PDF preview renders bright** — PDF.js viewers run in a sandboxed iframe; Tampermonkey may not inject. Open the statement in a new tab and rely on the PDF reader's native dark mode.
- **Embedded iframe on Tax Statements is bright** — if the iframe is cross-origin (`*.adp.com` subdomain), the wildcard `@match` covers it; if it is from a third-party host, dark mode will not apply there.

## Source References

- AWS Cloudscape Dark Mode Standard for LLM v3.0 (color tokens, nuclear pass, observer pattern, top-bar detection, anti-patterns)
- Amazon Dark Mode LLM Playbook v1.0 (file/folder scheme, source-notation rules, repo init workflow)
