import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const file = (path) => readFile(path, "utf8");

test("experimental root is server-visible, static Japanese article text", async () => {
  const html = await file("index.html");
  assert.match(html, /<html lang="ja">/);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /<meta name="google-site-verification"/);
  assert.match(html, /<link rel="manifest" href="\.\/manifest\.webmanifest">/);
  assert.match(html, /<main>/);
  assert.match(html, /<article>/);
  assert.match(html, /<h1>Chromeは、今表示されている文章を読み上げるか<\/h1>/);
  assert.match(html, /これはトップページの静的記事読み上げ検証です/);
  assert.equal((html.match(/<p[\s>]/g) || []).length >= 8, true);
  assert.equal(html.includes("<script"), false, "No client-side article insertion");
  assert.equal(html.includes('rel="canonical"'), false, "Preserve absence of root canonical");
});
test("existing app remains available at /app and slot URLs stay out of scope", async () => {
  const root = await file("index.html");
  const app = await file("app/index.html");
  const manifest = JSON.parse(await file("manifest.webmanifest"));
  const slot = await file("articles/listen-slots/01.html");
  assert.match(root, /href="\.\/app\/"/);
  assert.match(root, /href="\.\/articles\/listen-slots\/"/);
  assert.match(app, /speechSynthesis/);
  assert.equal(manifest.scope, "./app/");
  assert.match(slot, /itemprop="articleBody"/);
});
