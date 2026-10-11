// Theme-only presentation. Classification, people, gifts and ranking stay shared.
window.GWLTheme = (() => {
  const tiers = {
    basic: ["Basic", "A little spark"],
    featured: ["Featured", "Sealed in wax"],
    stellar: ["Stellar", "The looking glass"],
    epic: ["Epic", "Nightfall"],
    legendary: ["Legendary", "The gilded curse"],
    mythic: ["Mythic", "Soul keeper"],
    celestial: ["Celestial", "Crimson reign"],
    primordial: ["Primordial", "Night rider"],
    cosmic: ["Cosmic", "Sovereign of the eclipse"],
  };
  const bat = '<svg viewBox="0 0 120 60" aria-hidden="true"><path class="bat-wing bat-wing--left" d="M60 30Q31 3 2 3L14 28Q26 17 32 38Q44 27 54 51L60 48Z"/><path class="bat-wing bat-wing--right" d="M60 30Q89 3 118 3L106 28Q94 17 88 38Q76 27 66 51L60 48Z"/><path d="m54 22 1-14 6 10 7-10-1 18q7 18-7 28-12-10-6-32Z"/></svg>';
  const ghost = '<svg viewBox="0 0 64 80" aria-hidden="true"><path d="M9 71Q5 53 10 28C14 0 51 1 54 27l3 44-12-6-10 10-10-9-16 5Z" fill="currentColor"/><ellipse cx="24" cy="31" rx="4" ry="7" fill="#14202a"/><ellipse cx="42" cy="31" rx="4" ry="7" fill="#14202a"/><ellipse cx="33" cy="49" rx="4" ry="6" fill="#14202a"/></svg>';
  const sparks = (count, className) => '<span class="' + className + '" aria-hidden="true">' +
    Array.from({ length: count }, (_, i) => '<i style="--i:' + i + ';--x:' + ((i * 37 + 9) % 94) + '%;--drift:' + ((i % 2 ? 1 : -1) * (1 + i % 4)) + 'rem"></i>').join("") + '</span>';
  const swarm = (count) => '<span class="haunt-swarm" aria-hidden="true">' +
    Array.from({ length: count }, (_, i) => '<span class="haunt-bat" style="--i:' + i + ';--flight:' + (i % 2 ? -1 : 1) + '">' + bat + '</span>').join("") + '</span>';
  const droplets = '<span class="haunt-drips" aria-hidden="true">' +
    [0, 1, 2, 3].map(i => '<i style="--i:' + i + '"><b></b></i>').join("") + '</span>';
  const effects = {
    epic: () => swarm(4),
    legendary: () => '<span class="haunt-impact" aria-hidden="true"></span>' + sparks(9, "haunt-shards") + sparks(6, "haunt-embers"),
    mythic: () => '<span class="haunt-soul" aria-hidden="true">' + ghost + '</span><span class="haunt-soul haunt-soul--second" aria-hidden="true">' + ghost + '</span>',
    celestial: () => droplets + '<span class="haunt-ripple" aria-hidden="true"></span>',
    primordial: () => '<span class="haunt-headlights" aria-hidden="true"><i></i><i></i></span><span class="haunt-road" aria-hidden="true"></span>' + swarm(3),
    cosmic: () => '<span class="haunt-eclipse" aria-hidden="true"></span><span class="haunt-gates" aria-hidden="true"><i></i><i></i></span>' + sparks(12, "haunt-shards haunt-shards--orbit") + swarm(6),
  };

  function identity(event, helpers) {
    return '<strong class="haunt-name">' + helpers.escapeText(event.person.name) + '</strong>' +
      helpers.message(event.gift, "haunt-message");
  }

  function render(event, helpers) {
    const { escapeText, avatar } = helpers;
    if (event.type === "join") {
      return '<article class="receipt-item haunt-follow"><span class="haunt-follow__ghost" aria-hidden="true">' + ghost +
        '</span><div><strong>' + escapeText(event.person.name) + '</strong><span>Welcome, hello!</span></div></article>';
    }
    if (event.type === "follow") {
      return '<article class="receipt-item haunt-card haunt-card--basic haunt-card--follower"><span class="haunt-candle" aria-hidden="true"></span>' +
        avatar(event.person, "haunt-avatar") + '<div class="haunt-compact-content"><span class="haunt-level">Basic</span><strong class="haunt-name">' + escapeText(event.person.name) + '</strong><span class="haunt-message">New follower · Welcome!</span></div></article>';
    }
    const tier = Object.hasOwn(tiers, event.gift.tier) ? event.gift.tier : "basic";
    const [label, title] = tiers[tier];
    const open = '<article class="receipt-item haunt-card haunt-card--' + tier + '">';
    if (tier === "basic" || tier === "featured") {
      return open + '<span class="haunt-candle" aria-hidden="true"></span>' +
        avatar(event.person, "haunt-avatar") + '<div class="haunt-compact-content"><span class="haunt-level">' + label +
        '</span>' + identity(event, helpers) + '</div>' +
        (tier === "featured" ? '<span class="haunt-wax" aria-hidden="true">✦</span>' : '') + '</article>';
    }
    if (tier === "stellar") {
      return open + '<span class="haunt-level">' + label + '</span><span class="haunt-moon" aria-hidden="true"></span>' +
        '<div class="haunt-looking-glass">' + avatar(event.person, "haunt-avatar") + '</div>' +
        '<div class="haunt-identity"><h3 class="haunt-title">' + title + '</h3>' + identity(event, helpers) + '</div></article>';
    }
    return open + '<div class="haunt-scene" aria-hidden="true"><span class="haunt-art"></span>' +
      '<span class="haunt-sculpture"></span><span class="haunt-mist"></span>' + effects[tier]() +
      '<span class="haunt-vignette"></span></div>' +
      '<span class="haunt-level">' + label + '</span>' +
      '<div class="haunt-portrait"><span class="haunt-portrait__mount" aria-hidden="true"></span>' +
      avatar(event.person, "haunt-avatar") + '</div>' +
      '<div class="haunt-identity"><h3 class="haunt-title">' + title + '</h3>' + identity(event, helpers) + '</div>' +
      '<span class="haunt-baseline" aria-hidden="true"></span></article>';
  }
  return { title: "Spirit press", render };
})();
