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
  load(ctx, "js/printer/printer-components.js");
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
    for (const script of [
      "../../js/core/data.js",
      "../../js/core/gift-tiers.js",
      "../../js/ui/top-three.js",
      "../../js/printer/feed.js",
      "../../js/live/live-events.js",
      "../../js/printer/app.js",
      "../../js/printer/printer-shell.js",
    ]) {
      assert.ok(html.includes(script));
    }
    for (const [, resource] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      assert.ok(fs.existsSync(path.resolve(path.dirname(file), resource)), resource);
    }
    if (theme === "default") assert.ok(!html.includes("halloween"));
  }
  for (const theme of ["default", "halloween"]) {
    const file = path.join(root, "designs", theme, "preview.html");
    const html = fs.readFileSync(file, "utf8");
    assert.ok(html.includes("../../css/pages/collection-preview.css"));
    assert.ok(html.includes("../../js/ui/collection-preview.js"));
    for (const [, resource] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (resource.startsWith("http") || resource.includes("?")) continue;
      assert.ok(fs.existsSync(path.resolve(path.dirname(file), resource)), resource);
    }
  }
  const prototype = fs.readFileSync(path.join(root, "prototypes/printer/printer-components.html"), "utf8");
  assert.ok(prototype.includes("designs/default/preview.html"));
  assert.ok(prototype.includes("designs/halloween/preview.html"));
});

test("Halloween scenes are local, bounded assets with distinct effects", () => {
  const effects = {
    epic: "haunt-swarm", legendary: "haunt-impact", mythic: "haunt-soul",
    celestial: "haunt-drips", primordial: "haunt-headlights", cosmic: "haunt-gates",
  };
  const css = fs.readFileSync(path.join(root, "designs/halloween/theme.css"), "utf8");
  for (const [tier, effect] of Object.entries(effects)) {
    assert.ok(context(true).render(event(tier)).includes(effect));
    const asset = path.join(root, "assets/images/halloween/" + tier + "-scene.webp");
    assert.ok(fs.statSync(asset).size < 512 * 1024);
    assert.equal(fs.readFileSync(asset).subarray(8, 12).toString(), "WEBP");
    assert.ok(css.includes(tier + "-scene.webp"));
  }
  assert.ok(css.includes("prefers-reduced-motion: reduce"));
  assert.ok(css.includes("nth-child(n+4)"));
  const html = fs.readFileSync(path.join(root, "designs/halloween/preview.html"), "utf8");
  assert.ok(html.includes("../../js/core/data.js"));
  assert.ok(html.includes("../../js/core/gift-tiers.js"));
  assert.ok(!html.includes("live-events.js"));
  assert.ok(!html.includes("app.js"));
});

test("decorative animationend events cannot finish the paper reveal", () => {
  let listener;
  let removed = false;
  const classes = new Set();
  const fresh = {
    classList: { add: name => classes.add(name), remove: name => classes.delete(name) },
    addEventListener: (_, callback) => { listener = callback; },
    removeEventListener: (_, callback) => { removed = callback === listener; },
  };
  const container = {
    children: [], parentElement: { clientHeight: 500 },
    insertAdjacentHTML() { this.children = [fresh]; this.firstElementChild = fresh; },
  };
  const ctx = vm.createContext({
    window: { GWLPrinterComponents: { render: () => "<article></article>" } },
    document: { querySelectorAll: () => [], querySelector: () => null },
    requestAnimationFrame: () => {},
  });
  load(ctx, "js/printer/feed.js");
  ctx.window.GWLFeed.insert(container, event("cosmic"));
  listener({ target: {}, animationName: "haunt-gate-left" });
  assert.ok(classes.has("receipt-item--printing"));
  assert.equal(removed, false);
  listener({ target: fresh, animationName: "unrelated" });
  assert.ok(classes.has("receipt-item--printing"));
  listener({ target: fresh, animationName: "print-row" });
  assert.equal(classes.has("receipt-item--printing"), false);
  assert.equal(removed, true);
});
