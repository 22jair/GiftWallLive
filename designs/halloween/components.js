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
  const skull = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8c-25 0-39 17-39 39 0 15 8 24 19 30v14h12V81h16v10h12V77c11-6 19-15 19-30C89 25 75 8 50 8Z" fill="currentColor"/><ellipse cx="35" cy="45" rx="9" ry="12" fill="#191222"/><ellipse cx="65" cy="45" rx="9" ry="12" fill="#191222"/><path d="m50 51-6 11h12Zm-14 16h28v13H36Z" fill="#191222"/><path d="M42 69v11m8-11v11m8-11v11" stroke="currentColor" stroke-width="3"/></svg>';
  const batSwarm = '<svg viewBox="0 0 360 150" aria-hidden="true"><g fill="currentColor"><path d="M40 74 4 48l13 31-17 9 31 3 9 27 9-27 31-3-17-9 13-31Z"/><path d="M112 42 84 20l9 24-14 7 25 2 6 20 7-20 25-2-14-7 9-24Z"/><path d="M184 28 148 4l14 30-18 8 31 3 9 27 9-27 31-3-18-8 14-30Z"/><path d="M270 57 236 32l12 30-17 8 30 3 8 25 9-25 30-3-17-8 12-30Z"/><path d="M340 102 313 82l9 25-14 7 24 2 6 20 7-20 24-2-14-7 9-25Z"/><path d="M224 110 198 93l8 23-13 7 23 2 6 18 6-18 23-2-13-7 8-23Z"/><path d="M67 130 43 112l8 23-13 7 23 2 6 18 6-18 23-2-13-7 8-23Z"/></g></svg>';
  const wolf = '<svg viewBox="0 0 150 100" aria-hidden="true"><path d="M12 91q15-18 27-20L30 44l22 13 15-20 9 19q18-9 37-4l-4 11 18 5-22 7q-1 9 8 16H82l-7-14-9 14H27Z" fill="currentColor"/><path d="m67 37-8-25 18 16 13-23 2 29" fill="currentColor"/><circle cx="92" cy="55" r="3" fill="#ffd18f"/><path d="M102 67q15 3 22-3" fill="none" stroke="#ffd18f" stroke-width="2" stroke-linecap="round"/></svg>';
  const fangs = '<svg viewBox="0 0 260 90" aria-hidden="true"><path d="M5 6h250" stroke="currentColor" stroke-width="3"/><path d="M18 7l10 48 9-31 10 48 11-65 12 35 13-20 11 43 12-58 13 29 12-27 12 64 12-47 13 32 13-51 12 59 12-38 11 43 12-34 12 47 11-43 13 55 9-48" fill="currentColor" opacity=".9"/><path d="M55 72q3 12 8 0m92-2q3 15 8 0m54-4q3 12 8 0" stroke="#d45a61" stroke-width="4" stroke-linecap="round"/></svg>';
  // An original nocturnal carriage: pointed grille, wing-like fenders and copper wheels.
  const nightRunner = '<svg viewBox="0 0 320 120" aria-hidden="true"><path d="M36 82h248l-18-27-31-8-19-22h-69L126 47l-54 8Z" fill="currentColor"/><path d="m126 47 22-22h53l20 22m-87 0h88" fill="none" stroke="#e5b976" stroke-width="4"/><path d="m72 57-42-16 27 29m191-13 42-16-27 29" fill="none" stroke="#e5b976" stroke-width="4"/><circle cx="91" cy="86" r="22" fill="#201525" stroke="#e5b976" stroke-width="6"/><circle cx="245" cy="86" r="22" fill="#201525" stroke="#e5b976" stroke-width="6"/><path d="M141 57h38l-8 15h-22Zm-93 0 18-6 11 8-28 7Zm196 0-18-6-11 8 28 7Z" fill="#ffc981"/><path d="M37 82h247" stroke="#ffe0a0" stroke-width="3"/></svg>';
  const impact = '<span class="haunt-impact"><i></i><i></i><i></i><i></i><b></b></span>';
  const blood = '<span class="haunt-blood"><i></i><i></i><i></i></span>';
  const hauntings = { epic: '<span class="haunt-cracks"></span><span class="haunt-bats">' + batSwarm + '</span>', legendary: impact + '<span class="haunt-skull">' + skull + '</span><span class="haunt-fangs">' + fangs + '</span>', mythic: '<span class="haunt-wolf">' + wolf + '</span><span class="haunt-bats">' + batSwarm + '</span><span class="haunt-skull haunt-skull--small">' + skull + '</span>', celestial: blood + '<span class="haunt-fangs">' + fangs + '</span><span class="haunt-bats haunt-bats--faint">' + batSwarm + '</span>', primordial: '<span class="haunt-runner">' + nightRunner + '</span><span class="haunt-wolf haunt-wolf--small">' + wolf + '</span><span class="haunt-bats haunt-bats--faint">' + batSwarm + '</span>', cosmic: blood + '<span class="haunt-runner">' + nightRunner + '</span><span class="haunt-wolf">' + wolf + '</span><span class="haunt-skull haunt-skull--small">' + skull + '</span><span class="haunt-bats">' + batSwarm + '</span>' };
  function render(event, { escapeText, avatar, message }) {
    if (event.type === "follow") {
      return '<article class="receipt-item haunt-follow"><span class="haunt-follow__ghost" aria-hidden="true">' + ghost + '</span><strong>' + escapeText(event.person.name) + '</strong><span>New follower</span></article>';
    }
    const tier = Object.hasOwn(tiers, event.gift.tier) ? event.gift.tier : "basic";
    const [label, caption] = tiers[tier];
    const compact = ["basic", "featured"].includes(tier);
    return '<article class="receipt-item haunt-card haunt-card--' + tier + (compact ? ' haunt-card--compact' : '') + '">' +
      '<span class="haunt-card__corners" aria-hidden="true"></span>' +
      '<span class="haunt-card__hauntings" aria-hidden="true">' + (hauntings[tier] || '') + '</span>' +
      '<span class="haunt-card__caption">' + caption + '</span>' +
      '<div class="haunt-portrait"><span class="haunt-wings" aria-hidden="true">' + wings + '</span><span class="haunt-ring" aria-hidden="true"></span>' +
      avatar(event.person, "haunt-avatar") +
      '<span class="haunt-charm" aria-hidden="true">' + (["legendary", "celestial"].includes(tier) ? pumpkin : ghost) + '</span></div>' +
      '<span class="haunt-seal">' + label + '</span><strong class="haunt-name">' + escapeText(event.person.name) + '</strong>' +
      message(event.gift, "haunt-message") + '<span class="haunt-motes" aria-hidden="true"></span></article>';
  }
  return { title: "Spirit press", render };
})();
