// Run with: node --test tests/design-contract.test.cjs
// Uses Node's built-in runner only; no packages or running server.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
function load(context, file) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
}
function context(theme) {
  const ctx = vm.createContext({ window: {} });
  if (theme) load(ctx, "designs/halloween/components.js");
  load(ctx, "js/printer-components.js");
  return ctx.window.GWLPrinterComponents;
}
const tiers = ["basic", "featured", "stellar", "epic", "legendary", "mythic", "celestial", "primordial", "cosmic"];
function event(tier) {
  return { type: "gift", person: { name: '<img src=x onerror="bad">', avatar: "" }, gift: { tier, amount: 20, points: 1, name: "Rose" } };
}
test("both renderers support every gift level and escape participant text", () => {
  for (const halloween of [false, true]) {
    const renderer = context(halloween);
    for (const tier of tiers) {
      const html = renderer.render(event(tier));
      assert.equal((html.match(/<article /g) || []).length, 1);
      assert.ok(html.includes("receipt-item"));
      assert.ok(html.includes("&lt;img"));
      assert.ok(!html.includes('<img src=x'));
      assert.ok(html.includes("Thanks for ×20"));
      if (halloween) assert.ok(html.includes("haunt-card--" + tier));
    }
    assert.ok(renderer.render({ type: "follow", person: { name: "<follower>" } }).includes("&lt;follower&gt;"));
  }
});
test("Halloween preserves real gift images and avatars", () => {
  const data = event("cosmic");
  data.person.avatar = "https://example.com/avatar.png";
  data.gift.icon = "https://example.com/rose.png";
  const html = context(true).render(data);
  assert.ok(html.includes(data.person.avatar));
  assert.ok(html.includes(data.gift.icon));
});
test("entrypoints reuse the common engine and local resource paths exist", () => {
  for (const theme of ["default", "halloween"]) {
    const file = path.join(root, "designs", theme, "index.html");
    const html = fs.readFileSync(file, "utf8");
    for (const script of ["data", "gift-tiers", "top-three", "feed", "live-events", "app", "printer-shell"]) {
      assert.ok(html.includes("../../js/" + script + ".js"));
    }
    for (const [, resource] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      assert.ok(fs.existsSync(path.resolve(path.dirname(file), resource)), resource);
    }
    if (theme === "default") assert.ok(!html.includes("halloween"));
  }
});
