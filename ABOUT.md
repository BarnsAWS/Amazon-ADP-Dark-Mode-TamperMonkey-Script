# About This Repository

## Purpose

This repository delivers a Tampermonkey userscript that re-themes the Amazon employee ADP portal at `https://my.adp.com` (Pay, Tax Statements, Tax Withholding, Wisely, Company) using the AWS Cloudscape "Polaris Dark Mode" token palette so it visually matches Optics, the AWS Console, and other Cloudscape-based internal tools.

## Design Principles

- **Cloudscape palette as ground truth.** Surfaces, text tiers, links, borders, focus rings, and primary actions all use Cloudscape tokens (`#161d26` body, `#42b4ff` link, `#ff9900` primary action). No hand-picked hex values.
- **Two-layer architecture.** CSS injected at `document-start` for an immediate dark paint; JS computed-style scanner as the safety net for inline styles, runtime injections, and shadow roots.
- **Hands off chart and media content.** ADP's pay-breakdown donut chart relies on green (Take Home) versus red (Taxes) segments to communicate pay composition at a glance. The script intentionally excludes `svg`, `canvas`, `picture`, `video`, and `img` — and every SVG child element — from both the CSS recolor and the JS pass. Inputs are also excluded from the global text recolor so form fields keep readable foreground from the input style block.
- **Hands off the cascade.** No `filter: invert(1)`. Brand colors (Amazon Orange CTA, ADP green/red status, donut segments) are preserved.
- **Defensive against framework toggles.** A `data-color-scheme` and `color-scheme: dark` are re-asserted on every observer tick so the underlying ADP framework cannot revert to light.

## Script Architecture

`amazon_adp_dark_mode.user.js` runs in five phases:

1. **Framework hook.** Sets `color-scheme: dark`, `data-color-scheme=dark`, and `data-theme=dark` on `<html>`.
2. **CSS injection at `document-start`.** A single stylesheet covers nuclear text, transparent cascade, headings, stat amounts, links, inputs, buttons, primary CTAs, cards/widgets, tables with zebra striping, modals, menus, dropdowns, popovers, tooltips, the left-rail navigation, the top bar (amazon logo + ADP Assist + avatar), info banners (the privacy notice), tabs, selected/active states, badges/pills, breadcrumbs, scrollbars, and stubborn inline-style overrides.
3. **JS nuclear pass.** Walks every non-media, non-input element, parses computed `background-color` and `color`, and reassigns to the Cloudscape surface or text tier whose luminance bucket matches (>200 → primary, >140 → secondary, >100 → tertiary; brand-blue heuristic → tertiary). Excludes all SVG descendants so chart segments are untouched.
4. **Top-bar detection.** Combines selector- and position-based detection (`fixed`/`sticky`/`absolute` with `top < 100px`) to force header surfaces to `#161d26`. Catches the amazon-logo masthead even when its class names are obfuscated.
5. **Mutation observer + load-time safety net.** 250 ms debounce on subtree mutations; explicit re-runs at 500 ms, 1500 ms, and 3000 ms after `load` to catch lazy-loaded Featured Content tiles, statement rows, and tab-switch content. Open shadow roots receive the same stylesheet appended.

## Why This Repository Exists

ADP is one of the few payroll portals Amazon employees interact with regularly, and `my.adp.com` ships only a light theme. The Pay page combines a high-contrast donut chart, a tabular breakdown, and a tile grid of articles — all of which are punishing on the eyes at night against a white shell. This script delivers a single, predictable, Cloudscape-aligned dark experience that survives SPA route changes between Pay / Tax Statements / Tax Withholding and preserves the donut chart's red/green semantics.

## Maintenance Notes

- Keep `amazon_adp_dark_mode.user.js` at the repository root so the GitHub raw URL is the canonical Tampermonkey install link.
- Cloudscape tokens are the source of truth. If Cloudscape revises the dark palette, update the constants block at the top of the userscript.
- Validate after each ADP UI update: shell, left rail, top bar, privacy banner, tabs, Pay donut + breakdown, Featured Content tile grid, statement viewer.
- If ADP migrates to a Web Component / Shadow-DOM stack, validate that the shadow-root piercing function still attaches the stylesheet to all nested hosts.
- Do not add an SVG recolor block. The donut chart depends on green/red semantics to communicate pay composition.

## Source References

- `AWS\Amazon AWS Dark Mode Standard for LLM.md` (v3.0) — palette, CSS rules, nuclear pass, observer pattern, anti-patterns, framework hooks.
- `Amazon Dark Mode LLM Playbook\AMAZON_DARK_MODE_LLM_PLAYBOOK.md` (v1.0) — naming, folder scheme, source-notation rules, repo initialization workflow under the `BarnsAWS` GitHub org.
