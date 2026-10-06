# STR Read Aloud Mirror Experiment

Created: 2026-10-07

Purpose: compare Chrome Android Read Aloud behavior across hosting environments while holding the page bundle constant.

## Source

The mirror copies these files from `Josh-Temple/systematic-trading-research` main without editing their contents:

- `web/index.html` — blob `4ca9ebb4a8522c02bc94e759cec420ab2ee2f73d`
- `web/styles.css` — blob `832aa66587af4bb5be797a161155895edd14ace5`
- `web/app.js` — blob `eae0f8fd7f0e040bf55c27ecdeb5fe0b274377ad`
- `web/data/horizontal-reaction-v0.1.js` — blob `cfcb2b5e3abaf0b402e9af524927bc394df968f1`

The original successful page is:

- https://josh-temple.github.io/systematic-trading-research/

After this branch is merged and both deployments update, test:

- GitHub Pages mirror: https://josh-temple.github.io/instant-radio/experiments/read-aloud/str-mirror/
- Vercel mirror: https://instant-radio.vercel.app/experiments/read-aloud/str-mirror/

## What this experiment can test

Because both mirror URLs are served from the same repository files, a persistent difference between the two mirrors would be evidence for a hosting- or delivery-correlated factor.

Because both mirror URLs are new, if both initially fail this experiment cannot distinguish a hosting effect from URL-specific readability classification or other shared conditions.

The existing successful original remains the positive control.

## Record separately

For each URL, record:

- date/time JST
- Chrome version
- normal vs incognito if tested
- Reader Mode: available / unavailable
- Read Aloud: available / unavailable
- page visually loaded correctly: yes / no

Do not alter the mirrored files between observation points.
