# Android Chrome native Read Aloud: fixed-slot negative controls and restored positive URL

Date: 2026-10-17 JST

## Latest actual Android observation

The user explicitly confirmed after checking Chrome's setting `検索とブラウジングを改善する`:

| URL | Chrome 「このページを読み上げ」 | Status |
|---|---|---|
| `https://josh-temple.github.io/instant-radio/` | **Available** | real-device positive control (reported 2026-10-16) |
| `https://josh-temple.github.io/instant-radio/articles/listen-slots/01.html` | **Unavailable** | real-device negative (reported 2026-10-16; reiterated 2026-10-17) |
| `https://josh-temple.github.io/instant-radio/articles/listen-slots/07.html` | **Unavailable** | real-device negative (reported 2026-10-17) |

The other slots are not all tested. Slot 01 lacks viewport meta and has `min-width:780px`; slot 07 has responsive viewport and layout. Since both failed, the `min-width` alone does not explain the result. The actual Google/Chrome server-side classifier is unknown; neither waiting nor HTML rewrites are known to force eligibility.

## Previously demonstrated positive static URL

Historical commit `206226752fc8d82c687fd4e5077e4d156d707def` carried:
`articles/read-aloud-test-2.html` with Git blob `11fe66864b6c728008fbc0d46081e2a371222255`.

Historical project findings and product design recorded an Android Chrome test where native Read Aloud remained enabled **after changing the static body at the same URL** and played the updated text. This is more relevant than dynamically mutating the already-readable root URL: the product design document states the dynamic root article view did not cause Chrome to narrate the local text.

At the time of this investigation, `articles/read-aloud-test-2.html` was **missing from main**. This change restores the historical file **byte-for-byte** to the same path; it does not alter the readable homepage or 100 slot pages. Source and restored blob SHA are identical.

## Test protocol after actual GitHub Pages publication

Open the following in a **normal Android Chrome tab** (not installed PWA, not Vercel):

https://josh-temple.github.io/instant-radio/articles/read-aloud-test-2.html

1. Verify the page renders, with heading 「固定URLの本文を書き換えてもChromeは新しい文章を読むか」.
2. Check whether Chrome's own three-dot menu offers 「このページを読み上げ」.
3. If available, start it and confirm the article begins 「これは固定URL本文更新テストです」.
4. Separately reconfirm the top URL remains readable. Record date, Chrome version if available, and Reader Mode separately.

Potential outcomes:
- Menu available and current article narrated: strong evidence that reactivating a **historically eligible static URL** is practical.
- Menu available but audio has wrong/old content: URL eligibility and body extraction may be out of sync.
- Menu unavailable: past eligibility was not preserved across deletion/republishing, or the classifier/state changed for other reasons. Do **not** infer an HTML fix or a deterministic expiration time.

Do not label the restored URL `confirmed` until this **new** real-device test. Do not modify or rotate any of the 100 slots based on these observations. Do not publish private/local user text in this public repo.

## Separate fallback

Draft PR #16 provides a Web Speech API player; the user reported this player can play audio on Android. It is **not** Chrome native Read Aloud, and fallback success does not resolve native eligibility.

## Restoration re-test: negative (reported 2026-10-17 JST)

After PR #17 (merge commit `1987ea196eacb9cdee12e11cc6265a4912f341ca`) was published via successful GitHub Pages run [38970334755](https://github.com/Josh-Temple/instant-radio/actions/runs/38970334755), the user opened the restored historical article URL in Chrome and reported **「現時点では読み上げ不可」**.

Evidence:
- Historical blob SHA `11fe66864b6c728008fbc0d46081e2a371222255` matched the restored blob **exactly**.
- Historic Android test: native Read Aloud worked, including an updated static body while the URL remained available.
- Present Android test, **after restoring the file at the original path**: native Read Aloud menu **unavailable**.

Inference limited to this experiment:
- Recreating an identical static HTML file at the former URL is **not sufficient** to restore Chrome-native eligibility immediately.
- This does **not** establish whether the reason was deletion/republishing, server-side classifier or cache behavior, Chrome version, another state change, or time since last observed success.
- Do **not** assert that it will become available after a particular number of hours/days. Chromium's local readability-result expiration (around an hour in the inspected source) is not Google server classifier refresh timing.
- Do **not** mark this URL as current `confirmed`. Keep the 100 rotation slots unchanged (0 currently confirmed, other slots not tested unless there are dated observations).

## Decision and next experiment boundary

Current real-device evidence contains only one **currently positive** URL in Instant Radio: the public root `https://josh-temple.github.io/instant-radio/` (last positively reported 2026-10-16; reconfirm before any modification).

The root is also the existing Instant Radio homepage. The separate PWA application is available under `/app/`; the public library is `/articles/listen-slots/`.

A narrowly controlled future experiment could test **server-visible, static article content at the exact existing root URL**, while linking to the full player at `/app/`. This is motivated by historical evidence that client-side DOM replacement on the readable root did **not** cause Chrome to narrate the substituted text.

**Do not merge or publish such a root rewrite without a separate explicit release decision**. It would modify the only currently readable URL and alter the homepage for visitors. Before any such release:
1. Save/verify exact existing root source and known-good commit; keep rollback path.
2. Confirm Chrome-native Read Aloud still available at root immediately before the trial.
3. Keep original `/app/` available, do not touch PWA/service-worker boundaries or the 100 slots.
4. Define timeboxed checks: Chrome menu availability, whether it reads the **new server-visible article**, and no regressions to `/app/`.
5. Roll back if root eligibility disappears or Chrome narrates unintended content; rollback itself cannot guarantee recovery of server-side eligibility.

Until then, no further URL rewrites, canonical manipulations, or invented eligibility requirements are justified by the evidence. The user confirmed the Web Speech fallback from PR #16 can play audio, but that is not native Chrome Read Aloud.
