# Instant Radio

## はじめて見る方へ

文章を貼り付けて連続再生する、小さなブラウザ読み上げアプリの個人実験です。操作の問題設定、キュー・長文分割・端末内保存・PWAの実装を、`index.html`・`sw.js`から確認できます。

**[公開デモを開く](https://josh-temple.github.io/instant-radio/)** / **試す方法:** 下記「Run locally」の手順でも起動できます。ブラウザ・端末ごとの音声やバックグラウンド動作には差があります。生成AIによる音声生成やサーバー側の文章処理は行っていません。

[全プロジェクトの案内](https://github.com/Josh-Temple)

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
- Play a built-in sample with one tap
- On supported Android/PWA setups, send selected text from the share sheet
- Keep pasted or shared text in the queue without interrupting current playback
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

## Chrome read-aloud experiment

Android Chrome's own **Listen to this page / このページを読み上げ** behavior is being tested separately from the Web Speech API player.

The current experiment set lives under `experiments/read-aloud/` and includes controlled variants for semantic HTML, `lang`, text length, list-heavy markup, delayed JavaScript insertion, article nesting, metadata, `nopagereadaloud`, and a Cocoon-like article structure.

The strongest result so far is not an HTML difference: on a GitHub Pages site where the existing top page is readable, a **byte-identical copy of that successful page at a newly created URL was not readable**. Chromium source also shows that Android Read Aloud requests a page-specific readability result for a URL. The Google server-side classifier itself is not public, so its exact criteria and re-evaluation timing remain unknown.

A corrected 2026-10-08 follow-up shows a more mixed pattern. Instant Radio's **GitHub Pages top page is readable**, but its linked Chrome read-aloud test page is not. Instant Radio's **Vercel deployment is also not readable**. The byte-identical new copy of the successful Systematic Trading Research top page remains unreadable as well. This keeps URL-specific readability state as the strongest explanation, while leaving a Vercel-specific or Vercel-correlated condition alive as an unresolved hypothesis. Older Vercel-hosted **World History Lab** and **GrokMath** also remain Reader Mode ○ / Read Aloud × examples. Search Console, Analytics, indexing, and fixed waiting periods continue to be treated as observation variables rather than proven eligibility requirements.

Detailed evidence, test URLs, interpretations, and the observation plan are recorded in:

- [Chrome Android read-aloud findings — 2026-10-07](docs/chrome-read-aloud-findings-2026-10-07.md)

The existing `reader.html?id=...` experiment still keeps queue text in the browser's `localStorage`; Instant Radio does not upload that text to an application server.

## Run locally

No build step is required.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish

The repository is designed to work as a static site. GitHub Pages, Vercel, Netlify, Cloudflare Pages, or any other static host can serve the root directory directly.

## Status

Early public demo. The goal is to test whether the interaction — **paste/share → play → continuous listening** — is useful enough to keep. The project intentionally stays small: it is also an example of using vibe coding to turn a minor personal inconvenience into a usable tool without building a large product.
