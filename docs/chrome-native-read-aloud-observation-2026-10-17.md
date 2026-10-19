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

## Live root static-article experiment: failed; home-screen shortcut differs (2026-10-17 JST)

The user explicitly accepted the risk and authorized a production experiment using the existing formerly readable root URL. PR #19 was merged as `62d68e347f5b4751bc1f8303a599b0a3f0520f38`. GitHub Pages build and deploy completed successfully in run [38995828997](https://github.com/Josh-Temple/instant-radio/actions/runs/38995828997), and the deployed commit's `index.html` blob was `67724220ad09907082bd79669ab89d777b77e19c`.

The experiment served a **static article directly in root HTML** whose first content paragraph began:

> これはトップページの静的記事読み上げ検証です。

The user then observed:

1. Opening the supplied normal GitHub Pages root link in Chrome: **native 「このページを読み上げ」 unavailable**.
2. Launching via a **previously saved home-screen icon/bookmark**: native reading **available**, but Chrome spoke the **older text**, not the new experiment article.

This is a **negative result** for the static-root-rewrite hypothesis in the tested entry path. The second path **cannot yet be interpreted as successful current-HTML extraction**.

### Alternative explanations (not yet separated)

- **Different destination URL or display context.** The web app manifest specifies `start_url: "./app/"`, `scope: "./app/"`, and `display: "standalone"`. Installed app launches and ordinary browser shortcuts can differ; the exact URL reached by the older icon is not yet known.
- **Old document served from device cache/legacy Service Worker.** The current `app/sw.js` only controls `/app/`, with network-first navigation and offline cache fallback. The root `sw.js` is a legacy unregistering script, but older installed contexts/storage may still differ; **do not assert** an old root SW definitely controlled this launch.
- **Chrome Read Aloud URL eligibility and extracted body state cached separately.** Chromium documents URL-specific readability results and caches. The observation alone does not reveal whether the displayed DOM was old or only playback was old.

Server-side and client-side HTML snapshots are **not** interchangeable evidence of actual playback text. GitHub Pages deployment success does not force Chrome's backend to refresh.

### Immediate rollback and preservation

The release acceptance gate for PR #19 required rollback if native Chrome Read Aloud disappeared or narrated wrong content. We restore `index.html` **byte-for-byte** from backup branch `backup/pre-root-native-readaloud-experiment-20261017`, baseline main `d33b21c87941f50b095dfd36c4d39460bcb2b4ff`, original root blob `0eaecbaf49160e0947c3cb34640f5d3b6efd8ef9`.

The experimental root-only test and GitHub Actions workflow are removed; current `/app/`, 100 fixed slots, manifest, SW scripts and draft Web Speech fallback PR #16 are unchanged. The experimental implementation remains inspectable in merged PR #19 and git history.

**Rollback of bytes does not guarantee rollback of Chrome-side readability or playback caches**. Do not label any route as currently positive again without new Android testing.

### Minimal no-destructive-data Android comparison

Before clearing cache or uninstalling the old home-screen entry:

1. Open the **old home-screen icon** and note **the URL or origin shown when sharing/copying its link** (or whether Chrome toolbar is hidden in a standalone app).
2. Note the **visible page title and first paragraph** separately from the **first spoken words**.
3. In a **normal Chrome tab**, open exactly `https://josh-temple.github.io/instant-radio/` without query/hash and record the title and native Read Aloud menu availability.
4. Only after these observations consider Chrome reload, site data clear or icon recreation. Never erase the old saved launch path before identifying it.

Three distinct outcomes to classify: (a) old visible+old spoken content, (b) new visible+old spoken content, (c) distinct app page/URL. The correct next action depends on which is observed.

## Confirmed displayed-content vs spoken-content mismatch (2026-10-17 JST, subsequent user clarification)

The user confirmed that, when they launched the older **home-screen shortcut** during the PR #19 root article experiment:

- **Visible text:** the **new article text**, not the former homepage text.
- **Chrome native Read Aloud speech:** the **older text**, not what was visible on the page.
- **A normally opened link to the root** did not offer native Read Aloud.

Therefore **"old HTML was simply being displayed" is not a sufficient explanation of this observed mismatch**. This is positive evidence of a **display/playback content divergence**. It does not independently identify where old speech content was held or the actual destination URL opened by the home-screen shortcut.

An official Google Chrome Enterprise policy description states that Android Chrome's Listen To This Page uses **server-side content distillation and audio synthesis** (https://chromeenterprise.google/policies/listen-to-this-page-enabled/). That mechanism makes a server-side snapshot/refresh lag **plausible**, but the user's observation alone does not establish:
1. A specific cache implementation or TTL.
2. Whether Chrome resumed an older playback session instead of starting a fresh extraction.
3. Whether the older shortcut opens the root URL or the installed PWA route `/app/` (manifest `start_url`).
4. That changing/clearing site storage, refreshing, or changing URLs would force up-to-date native speech.

### Next non-destructive observations

**Do not clear Chrome storage, uninstall/recreate the home-screen shortcut, or change the root HTML again at this stage.**

While the old shortcut still exists, identify its effective destination URL or whether it opens a standalone PWA without the normal address bar. At a future controlled test where displayed and spoken content diverge, separately log:
- visible title/first sentence,
- spoken first sentence,
- whether speech starts from a new Chrome menu invocation or resumes an existing session,
- actual opened URL / launch mode.

Current release state: the root source was reverted in PR #20 to exact pre-experiment blob `0eaecbaf49160e0947c3cb34640f5d3b6efd8ef9`, and the corresponding GitHub Pages deploy succeeded. Reversion does not prove Chrome's recognition/audio extraction state is fresh.

## Home-screen launcher mode clarification (2026-10-18 JST)

User confirmed: **when opening from the previously saved home-screen icon, the Chrome address bar is visible**. This makes it **more consistent with a standard Chrome browser tab/shortcut** than with a standalone installed PWA (which ordinarily hides the browser address bar). It is not definitive identification of the destination URL, browser task, or cached playback session.

Retain earlier confirmed observations from the 2026-10-17 static-root test: visible article was the **new** static article, audio narrated the **old** content; the link opened from chat had native Read Aloud **unavailable**.

**Update to competing hypotheses**:
- Standalone PWA display mode: **less likely** for the old launcher path, given a visible address bar; not established as the cause.
- Distinct URL/path/query or an existing Chrome tab/session: **still possible** until the full URL in the visible address bar is captured.
- Old Chrome narration/extraction independently of visible DOM: still possible. Chrome's official help says reading may continue while switching among tabs, so a resumed previous playback session should also be ruled out before attributing old audio to Google server-side caching. See https://support.google.com/chrome/answer/14768725?hl=ja .

**Next non-destructive request to user:** Open the original home-screen shortcut and **copy the full URL from the address bar without reloading**, then share it. Do not clear storage, remove the shortcut or edit the homepage. After the target URL is known, explicitly distinguish a newly invoked "このページを読み上げ" session from continuing/resuming the previously started speech session.

## Exact URL of older home-screen Chrome shortcut confirmed (2026-10-19 JST)

The user copied and supplied the **full address-bar URL** from the previously created Android home-screen shortcut:

`https://josh-temple.github.io/instant-radio/`

This is **identical to the canonical bare root path used by the normal chat link** during the 2026-10-17 production experiment. The user also separately confirmed the shortcut shows a Chrome address bar (2026-10-18). Thus **different URL, path, query parameters, or fragment** do **not** explain the reported discrepancy for the captured URL. (Different tab/browser contexts or retained read-aloud playback state remain possible.)

Historical paired observation: when the experimental static root article was live, the screen displayed its **new** text, but the older home-screen Chrome entry allowed native speech that read **old** text; opening that same URL from the chat link did not offer native Read Aloud.

### Remaining hypotheses; no causal assertion yet

1. **Previously initiated Read Aloud session resumed/continued**. Official Chrome Help states that Read Aloud can continue while switching tabs and with the display locked: https://support.google.com/chrome/answer/14768725?hl=ja .
2. **Page eligibility and/or distilled speech content retained independently of displayed HTML in Chrome or its service infrastructure**. Google Chrome Enterprise policy describes server-side content distillation and audio synthesis: https://chromeenterprise.google/policies/listen-to-this-page-enabled/ . However, this does **not** prove any specific stale-cache root cause or refresh interval.
3. **Per-tab/profile/browser-instance state** despite identical URL; browser tabs and launch context may differ.

### Single most informative next observation

Ask whether, after tapping the old home-screen shortcut, the user **newly selected** Chrome's three-dot menu `このページを読み上げ` to begin playback, or instead **resumed/continued an already existing player/audio session**. That distinguishes the strongest session-reuse alternative without clearing cache, deleting bookmarks, or changing HTML.

Current main top `index.html` was verified 2026-10-19 as original blob SHA `0eaecbaf49160e0947c3cb34640f5d3b6efd8ef9` after PR #20 rollback. Do **not** change it for this documentation update.

## Explicit fresh menu invocation, but old speech (reported 2026-10-20 JST)

The user clarified that **they actively tapped Chrome's overflow menu `このページを読み上げ` anew** from the older home-screen Chrome tab. They did **not merely tap Resume/Play on an already visible player**. The exact URL was previously confirmed as `https://josh-temple.github.io/instant-radio/` in both entry paths.

Combined direct observations from the 2026-10-17 root article trial:

| Dimension | Older Android home-screen Chrome shortcut | Link opened from chat |
| --- | --- | --- |
| URL | Exactly the bare root, confirmed from address bar | Same bare root |
| Browser chrome | Address bar shown | User describes opening a normal link; app-to-browser launch context not independently verified |
| Visible content | **New static article** at that time | New static article deployed at same root |
| Chrome native menu | **Available, actively invoked anew** | Unavailable |
| Narration | **Older text**, different from visible new article | None |

This strongly contradicts a simple explanation that the user accidentally resumed audio by pressing the old mini-player. It does **not** categorically rule out Chrome's *automatic* saved-playback restoration.

### Source-level separation: cached readability vs narrated body vs saved playback state

1. **Readability state is cached client-side per URL** in the cited Chromium `ReadAloudController.java`. `sReadabilityInfoMap` is an LRU map; `maybeCheckReadability()` reuses an unexpired result. In the inspected snapshot it expires after `HOUR_TO_MS` = one hour. This describes **client-side readability check state**, **not** an established Google server-side speech-content cache TTL: https://chromium.googlesource.com/chromium/src/+/7c0f87e29c4ff8bcdfe9a6eee0a1ae3cdb2ac708/chrome/browser/readaloud/android/java/src/org/chromium/chrome/browser/readaloud/ReadAloudController.java
2. In the same file, `playTab()` explicitly checks for a saved playback state tied to the same `Tab` and may invoke `restoreStateOnForeground()` **even after the overflow-menu action**. Therefore a fresh menu tap by itself does not prove the underlying speech data was freshly generated.
3. For a genuinely new playback, `PlaybackArgs` includes the sanitized URL and a `dateModifiedMsSinceEpoch` extracted from the tab (or 0 on failure). The implementation of the downstream Android content/speech backend cannot be inferred from this argument alone.
4. Google Chrome Enterprise's policy document confirms Android Listen To This Page uses **server-side content distillation and audio synthesis**: https://chromeenterprise.google/policies/listen-to-this-page-enabled/ . A stale backend extraction is **plausible**, **not verified**.

### Best next non-destructive experiment

Keep original home-screen shortcut and Chrome browsing data intact. To isolate **ChatGPT's link-opening context vs Chrome tab context**, open **the exact same URL in a brand-new normal Chrome tab by typing/pasting it directly into Chrome's address bar** (do not navigate via the ChatGPT link, home shortcut or PWA). Compare if the overflow-menu native `このページを読み上げ` entry is present. If it is present, invoke it and record the first narrated sentence; if absent, record absence.

This experiment holds URL and browser identity constant while changing tab/launch context, without clearing any cache. Note that PR #20 already reverted the root HTML, so the original new-article vs old-audio mismatch cannot be reproduced from current production content without another authorized content change. **Do not perform that content change at this stage.**

**Current release boundary:** baseline root blob `0eaecbaf49160e0947c3cb34640f5d3b6efd8ef9` remains unmodified; PR #16's Web Speech fallback is separate and not proof of native Chrome eligibility.

## Fresh direct Chrome tab: native Read Aloud menu available (2026-10-20 JST)

Following the earlier request to isolate Chrome tab-launch context, the user **launched the Chrome app directly**, opened a **new tab**, entered the exact public root URL in the address bar, and reported **「読み上げは表示されます」**: the native `このページを読み上げ` menu entry is **present**.

Test URL: `https://josh-temple.github.io/instant-radio/`.

**What this confirms:** The bare root URL is not universally or irreversibly ineligible for native Read Aloud after the prior experiment and rollback. A newly created Chrome tab can offer the native menu on this user's device.

**What it does not confirm:** The user has **not yet reported starting audio** in this new tab, so successful fresh playback and correct/current body extraction remain **untested**. Earlier negative result opening a chat link was observed while the static experimental root HTML was live on 2026-10-17; the current positive occurs **after PR #20 restored the original root HTML**. Thus entry path is not the only changed variable, and **do not claim that in-app links cause the feature to fail** based on these two historical observations.

Verification at the repository: root `index.html` still has original restored blob SHA `0eaecbaf49160e0947c3cb34640f5d3b6efd8ef9`. The website itself and all 100 slots remain unchanged in this documentation-only update.

**Next non-destructive observation:** In that same newly created Chrome tab, tap the native menu entry and check (1) whether audio actually starts, and (2) whether narrated content matches the **currently visible restored Instant Radio home page**, rather than the static experimental article or unrelated stale text. Do not clear site data, delete the old home-screen shortcut, or rewrite the root again.
