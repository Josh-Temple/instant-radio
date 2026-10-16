import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const root = "articles/listen-slots/";
const read = (path) => readFile(root + path, "utf8");

test("all fixed URLs are preserved and have a separate, valid speech-fallback link", async () => {
  const index = await read("index.html");
  const registry = JSON.parse(await read("registry.json"));
  const ids = registry.slots.map((item) => item.id);
  assert.equal(registry.slot_count, 100);
  assert.equal(new Set(ids).size, 100);
  assert.equal((index.match(/class="listen-fallback"/g) || []).length, 100);
  for (const id of ids) {
    const html = await read(id + ".html");
    assert.match(html, /<article[\s>]/, id + ": static article preserved");
    assert.match(html, /itemprop="articleBody"/, id + ": readable article text");
    assert.match(index, new RegExp('href="\\./' + id + '\\.html"'), id + ": original URL");
    assert.match(index, new RegExp('href="\\./player\\.html\\?slot=' + id + '"'), id + ": fallback");
  }
});
test("fallback is a manually activated, bounded same-origin speech player", async () => {
  const html = await read("player.html");
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  assert.doesNotThrow(() => new vm.Script(scripts[0][1]), "inline JavaScript parses");
  assert.match(html, /new URLSearchParams\(location.search\)/);
  assert.match(html, /\^\(0\[1-9\]\|\[1-9\]\[0-9\]\|100\)\$/);
  assert.match(html, /fetch\("\.\/" \+ slot \+ "\.html"/);
  assert.match(html, /DOMParser\(\)\.parseFromString/);
  assert.match(html, /textContent = part/);
  assert.match(html, /SpeechSynthesisUtterance/);
  assert.match(html, /synth\.pause\(\)/);
  assert.match(html, /synth\.resume\(\)/);
  assert.match(html, /synth\.cancel\(\)/);
  assert.match(html, /window\.addEventListener\("pagehide"/);
  assert.match(html, /min="0\.8" max="4"/);
  assert.match(html, /バックグラウンドでの再生は保証されません/);
  assert.doesNotMatch(html, /autoplay|innerHTML\s*=|document\.write\(/i);
});
test("observed URL outcome is recorded without promoting any slot to confirmed", async () => {
  const registry = JSON.parse(await read("registry.json"));
  const first = registry.slots.find((x) => x.id === "01");
  assert.equal(first.read_aloud_status, "not_readable");
  assert.equal(first.read_aloud_checked_on, "2026-10-16");
  assert.equal(first.reader_mode_status, "not_checked");
  assert.equal(registry.slots.filter(x=>x.read_aloud_status==="confirmed").length,0);
  assert.equal(registry.slots.filter(x=>x.read_aloud_status==="not_checked").length,99);
});
