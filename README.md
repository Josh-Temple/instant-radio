# Instant Radio

Paste. Play. Keep moving.

Instant Radio is a deliberately small demo showing how far modern browser text-to-speech can go with almost no infrastructure.

The idea is simple: paste an article, memo, report, or any other text, add it to a queue, and listen. Multiple items play one after another like a personal radio station.

## Why this exists

This is not an attempt to build another AI podcast generator.

It is a vibe-coded experiment around a simpler observation:

> For many everyday listening use cases, the speech capability already available on a phone or browser is good enough to make useful audio media immediately.

There is no voice-generation API, no API key, and no server-side text processing in the current demo.

## What it does

- Paste text and start listening immediately
- Keep pasted text in the queue without interrupting current playback
- Turn automatic paste-to-play on or off
- Play multiple items continuously
- Pause, resume, skip, stop, reorder, and remove items
- Choose from voices exposed by the browser/device
- Change playback speed up to 4×
- Save the queue locally in the browser
- Split long text into smaller utterances for more reliable playback
- Work as a small installable/offline-capable web app where supported

## Privacy

The current version stores the listening queue in `localStorage` on the device. Text is not sent to an application server by Instant Radio.

The browser or operating system may implement speech synthesis differently depending on the selected voice. If that distinction matters for your use case, check the behavior and privacy documentation of your browser, OS, and installed voice engine.

## Limits

This demo intentionally does not include:

- automatic article extraction from a URL
- AI summarization
- generated two-person podcast conversations
- accounts or cloud sync
- analytics
- server-side audio files

Background playback and available voice quality vary by browser and device.

## Run locally

No build step is required.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish

The repository is designed to work as a static site. GitHub Pages, Vercel, Netlify, Cloudflare Pages, or any other static host can serve the root directory directly.

## Status

Early public demo. The goal is to test whether the interaction — **paste → play → continuous listening** — is useful enough to keep.
