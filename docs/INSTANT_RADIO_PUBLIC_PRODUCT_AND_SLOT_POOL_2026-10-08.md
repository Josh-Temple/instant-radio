# Instant Radio: public product and 100 fixed-URL Read Aloud pool

Date: 2026-10-08

## Decision

Instant Radio is no longer treated only as a small public demo. It is the public-facing utility and reading site used both by the owner and by visitors.

RSVP Learning remains a private learning/content workspace. Public content that should be heard through Chrome native Read Aloud is published to Instant Radio rather than making the RSVP repository public.

## Product roles

### Instant Radio — public

- Paste text and listen immediately with the browser/device speech API.
- Browse public reading material.
- Maintain a pool of 100 stable article URLs for Android Chrome native Read Aloud.
- Keep selected articles permanently by pinning/tagging them.
- Reuse ordinary confirmed-readable URLs from oldest to newest.

### RSVP Learning — private

- Personal learning system.
- RSVP / Learn / Listen content authoring and study history.
- Source workspace for content that may later be selected for public publishing.
- No requirement to expose the repository or its full history publicly.

## Fixed URL pool

Permanent paths:

- `articles/listen-slots/01.html`
- ...
- `articles/listen-slots/100.html`

The first six URLs were created earlier and are preserved unchanged to avoid throwing away any URL-specific readability state that may already be forming.

The other 94 URLs were created on 2026-10-08 with varied seed reading material across classics/literature, history, science, technology/AI, society, work/thinking, essays, cities/geography, and fiction.

## Replacement policy

Registry: `articles/listen-slots/registry.json`

A slot is eligible for ordinary replacement only when:

1. `read_aloud_status == "confirmed"`
2. `pinned == false`

Choose the eligible slot with the oldest:

1. `last_replaced_at`, otherwise
2. `updated_at`, then
3. slot id

Pinned pages are never automatically overwritten.

If there is no eligible slot, stop. Do not overwrite an unconfirmed or pinned URL.

## Saved pages

A long-term saved article should use:

- `pinned: true`
- descriptive tags
- a stable title
- its existing fixed URL

Saved content stays visible in the public library and is excluded from rotation.

## Privacy boundary

Anything written into a fixed URL is public web content. Do not publish secrets, credentials, personal information, confidential work, or text that should remain private.

Instant Radio's ordinary paste-and-play queue remains local to the browser. Publishing to a fixed URL is a separate operation.

## Read Aloud evidence behind this design

Observed on Android Chrome:

- existing GitHub Pages URLs can become Read Aloud eligible while newly created URLs may not;
- a byte-identical new URL can remain ineligible while the original URL is eligible;
- Instant Radio's previously eligible fixed article URL remained eligible after its static HTML body was replaced and Chrome read the new body;
- dynamically replacing the DOM of the already-eligible top page did not cause Chrome to read the pasted local-only text.

Therefore the working design is: **stable public URL + server-visible static article HTML + reuse after eligibility is confirmed**.

The exact Google/Chrome server-side eligibility criteria and timing remain unknown.
