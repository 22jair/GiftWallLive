// Halloween owns only its presentation. Helpers and all event data are shared.
window.GWLTheme = (() => {
  const tiers = {
    basic: ["Basic", "Candlelight"], featured: ["Featured", "Haunted ink"],
    stellar: ["Stellar", "Moon visitor"], epic: ["Epic", "Midnight wings"],
    legendary: ["Legendary", "Pumpkin royalty"], mythic: ["Mythic", "Ghost lantern"],
    celestial: ["Celestial", "Blood moon"], primordial: ["Primordial", "Ancient spell"],
    cosmic: ["Cosmic", "The final eclipse"],
  };
  const pumpkin = '<svg viewBox="0 0 100 80" aria-hidden="true"><path d="M49 18q-4-15 10-16l-3 17" fill="#a1b37c"/><ellipse cx="50" cy="47" rx="44" ry="30" fill="#df642b"/><ellipse cx="50" cy="47" rx="29" ry="30" fill="#fa9b40"/><ellipse cx="50" cy="47" rx="13" ry="30" fill="#ffb552"/><path d="m23 42 15-11 4 15Zm36 4 4-15 15 11ZM29 54l11 6 5-5 6 7 6-7 6 5 11-6-9 14H39Z" fill="#412132"/></svg>';
  const wings = '<svg viewBox="0 0 240 100" aria-hidden="true"><path d="M120 66C92 4 39 7 2 0l20 48q22-13 31 15 24-14 33 16l34 19 34-19q9-30 33-16 9-28 31-15l20-48c-37 7-90 4-118 66Z" fill="currentColor"/><path d="M8 5q60 15 112 88Q180 20 232 5M28 47l80 34M212 47l-80 34" fill="none" stroke="#f4c29a" stroke-opacity=".4" stroke-width="1"/></svg>';
  const ghost = '<svg viewBox="0 0 70 80" aria-hidden="true"><path d="M8 72V32C8-4 62-4 62 32v40l-10-9-9 10-9-10-10 10-8-9Z" fill="#d6eee0"/><ellipse cx="26" cy="32" rx="4" ry="7" fill="#233a3d"/><ellipse cx="45" cy="32" rx="4" ry="7" fill="#233a3d"/><ellipse cx="36" cy="49" rx="5" ry="6" fill="#233a3d"/></svg>';
  function render(event, { escapeText, avatar, message }) {
    if (event.type === "follow") {
      return '<article class="receipt-item haunt-follow"><span class="haunt-follow__ghost" aria-hidden="true">' + ghost + '</span><strong>' + escapeText(event.person.name) + '</strong><span>New follower</span></article>';
    }
    const tier = Object.hasOwn(tiers, event.gift.tier) ? event.gift.tier : "basic";
    const [label, caption] = tiers[tier];
    const compact = ["basic", "featured"].includes(tier);
    return '<article class="receipt-item haunt-card haunt-card--' + tier + (compact ? ' haunt-card--compact' : '') + '">' +
      '<span class="haunt-card__corners" aria-hidden="true"></span>' +
      '<span class="haunt-card__caption">' + caption + '</span>' +
      '<div class="haunt-portrait"><span class="haunt-wings" aria-hidden="true">' + wings + '</span><span class="haunt-ring" aria-hidden="true"></span>' +
      avatar(event.person, "haunt-avatar") +
      '<span class="haunt-charm" aria-hidden="true">' + (["legendary", "celestial"].includes(tier) ? pumpkin : ghost) + '</span></div>' +
      '<span class="haunt-seal">' + label + '</span><strong class="haunt-name">' + escapeText(event.person.name) + '</strong>' +
      message(event.gift, "haunt-message") + '<span class="haunt-motes" aria-hidden="true"></span></article>';
  }
  return { title: "Spirit press", render };
})();
