# Chrome Read Aloud fixed URL slot registry

Created: 2026-10-08

Purpose: keep a small pool of stable GitHub Pages URLs that may become eligible for Android Chrome Read Aloud, then reuse only confirmed-readable URLs by replacing article content without changing the URL.

## Rules

- Do not rename or delete slot URLs.
- Do not change canonical URLs.
- Initial content should remain substantial static article HTML.
- Record Android Chrome Read Aloud and Reader Mode separately.
- A slot becomes reusable only after Read Aloud is confirmed on the user's real Android device.
- When reusing a confirmed slot, preserve the URL and article-oriented HTML shell; replace the title/metadata/body as needed.
- Public slot content is public. Do not place sensitive or private text here.

## Slots

| Slot | Theme | URL | Published | Read Aloud | Reader Mode | Last content replacement |
|---|---|---|---|---|---|---|
| 01 | Chrome読み上げはURLごとに判定されるのか | https://josh-temple.github.io/instant-radio/articles/listen-slots/01.html | 2026-10-08 | NOT_CHECKED | NOT_CHECKED | initial |
| 02 | 古典を読むと、時間の感覚が少し変わる | https://josh-temple.github.io/instant-radio/articles/listen-slots/02.html | 2026-10-08 | NOT_CHECKED | NOT_CHECKED | initial |
| 03 | 都市はなぜ川のそばに生まれたのか | https://josh-temple.github.io/instant-radio/articles/listen-slots/03.html | 2026-10-08 | NOT_CHECKED | NOT_CHECKED | initial |
| 04 | 夜空の星は、なぜ昔の姿を見せるのか | https://josh-temple.github.io/instant-radio/articles/listen-slots/04.html | 2026-10-08 | NOT_CHECKED | NOT_CHECKED | initial |
| 05 | 急がない時間をつくる | https://josh-temple.github.io/instant-radio/articles/listen-slots/05.html | 2026-10-08 | NOT_CHECKED | NOT_CHECKED | initial |
| 06 | 終電のあとにだけ開く図書室 | https://josh-temple.github.io/instant-radio/articles/listen-slots/06.html | 2026-10-08 | NOT_CHECKED | NOT_CHECKED | initial |

## Existing confirmed reference

- `/articles/read-aloud-test-2.html`
  - Read Aloud: confirmed ○ after content replacement on 2026-10-08.
  - This is the strongest evidence so far that a readable fixed URL can keep its eligibility while serving newly updated static article text.
