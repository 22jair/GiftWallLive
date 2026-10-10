window.GWLPrinterComponents = (() => {
  const giftIconPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='3' y='9' width='18' height='12' rx='3' fill='%23ff4f9a'/%3E%3Cpath d='M12 9v12M3 13h18M12 9C8 9 6 7 7 5c1-2 4 0 5 4Zm0 0c4 0 6-2 5-4-1-2-4 0-5 4Z' fill='none' stroke='%23fff' stroke-width='1.5'/%3E%3C/svg%3E";

  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]);
  }

  function avatarImage(person) {
    if (/^(https?:|data:|blob:)/i.test(person.avatar || "")) return person.avatar;
    const palettes = [
      ["#d7a5b8", "#f1c9a5", "#713d59", "#3a2730"],
      ["#86b5c2", "#c98f6c", "#2d5264", "#262629"],
      ["#98d1cf", "#efb895", "#476c70", "#252a34"],
      ["#e5b479", "#c98f6c", "#7b4148", "#29242a"],
    ];
    const seed = [...person.name].reduce((total, character) => total + character.charCodeAt(0), 0);
    const [background, skin, shirt, hair] = palettes[seed % palettes.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="${background}"/><circle cx="24" cy="18" r="10" fill="${skin}"/><path d="M7 48c2-13 9-19 17-19s15 6 17 19" fill="${shirt}"/><path d="M13 17C14 7 20 3 27 5c7 2 9 8 7 15-5-4-11-7-21-3" fill="${hair}"/></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  function avatar(person, className) {
    return `<div class="${className}"><img alt="Avatar of ${escapeText(person.name)}" src="${avatarImage(person)}"></div>`;
  }

  function message(gift, className) {
    const icon = gift.icon || giftIconPlaceholder;
    return `<p class="${className} gift-message"><span>Thanks for ×${escapeText(gift.amount)}</span><img class="gift-message__icon" data-tiktok-gift-icon alt="${escapeText(gift.name)}" src="${escapeText(icon)}"></p>`;
  }

  function cardSparks(level) {
    const sparks = Array.from({ length: 10 }, (_, index) => (
      `<i class="gift-card-sparks__spark gift-card-sparks__spark--${index + 1}" aria-hidden="true"></i>`
    )).join("");
    return `<span class="gift-card-sparks gift-card-sparks--${level}" aria-hidden="true">${sparks}</span>`;
  }

  function basic(event, featured = false) {
    const variant = featured ? " gift-highlighted" : " gift-basic--gray";
    return `<article class="receipt-item gift-basic${variant}">${avatar(event.person, "gift-basic__avatar")}<div class="gift-basic__content"><strong class="gift-basic__name">${escapeText(event.person.name)}</strong>${message(event.gift, "gift-basic__gift")}</div></article>`;
  }

  function stellar(event) {
    return `<article class="receipt-item gift-stellar">${avatar(event.person, "gift-stellar__avatar")}<strong class="gift-stellar__name">${escapeText(event.person.name)}</strong>${message(event.gift, "gift-stellar__gift")}</article>`;
  }

  function epic(event) {
    return `<article class="receipt-item gift-epic"><div class="gift-epic__portrait">${avatar(event.person, "gift-epic__avatar")}<span class="gift-epic__spark" aria-hidden="true">✦</span><span class="gift-epic__spark" aria-hidden="true">✦</span><span class="gift-epic__spark" aria-hidden="true">✦</span><span class="gift-epic__spark" aria-hidden="true">✦</span><span class="gift-epic__seal">Epic</span></div><strong class="gift-epic__name">${escapeText(event.person.name)}</strong>${message(event.gift, "gift-epic__gift")}</article>`;
  }

  function legendary(event) {
    return `<article class="receipt-item gift-legendary"><div class="gift-legendary__portrait">${avatar(event.person, "gift-legendary__avatar")}<span class="gift-legendary__crown" aria-hidden="true">♛</span>${'<span class="gift-legendary__ember" aria-hidden="true"></span>'.repeat(6)}<span class="gift-legendary__seal">Legendary</span></div><strong class="gift-legendary__name">${escapeText(event.person.name)}</strong>${message(event.gift, "gift-legendary__gift")}</article>`;
  }

  function mythic(event) {
    return `<article class="receipt-item gift-mythic"><div class="gift-mythic__portrait"><span class="gift-mythic__orbit gift-mythic__orbit--one" aria-hidden="true"></span><span class="gift-mythic__orbit gift-mythic__orbit--two" aria-hidden="true"></span><span class="gift-mythic__bezel" aria-hidden="true"></span>${avatar(event.person, "gift-mythic__avatar")}<span class="gift-mythic__crescent" aria-hidden="true"></span><span class="gift-mythic__gem gift-mythic__gem--nw" aria-hidden="true"></span><span class="gift-mythic__gem gift-mythic__gem--ne" aria-hidden="true"></span><span class="gift-mythic__gem gift-mythic__gem--sw" aria-hidden="true"></span><span class="gift-mythic__gem gift-mythic__gem--se" aria-hidden="true"></span><span class="gift-mythic__seal">Mythic</span></div><strong class="gift-mythic__name">${escapeText(event.person.name)}</strong>${message(event.gift, "gift-mythic__gift")}</article>`;
  }

  function celestial(event) {
    return `<article class="receipt-item gift-celestial">${cardSparks("celestial")}<div class="gift-celestial__portrait"><span class="gift-celestial__crown" aria-hidden="true"></span><span class="gift-celestial__halo" aria-hidden="true"></span><span class="gift-celestial__diadem" aria-hidden="true"></span>${avatar(event.person, "gift-celestial__avatar")}<span class="gift-celestial__gem" aria-hidden="true"></span><span class="gift-celestial__shard gift-celestial__shard--left" aria-hidden="true"></span><span class="gift-celestial__shard gift-celestial__shard--right" aria-hidden="true"></span><span class="gift-celestial__shard gift-celestial__shard--left-mid" aria-hidden="true"></span><span class="gift-celestial__shard gift-celestial__shard--right-mid" aria-hidden="true"></span><span class="gift-celestial__shard gift-celestial__shard--left-low" aria-hidden="true"></span><span class="gift-celestial__shard gift-celestial__shard--right-low" aria-hidden="true"></span><span class="gift-celestial__seal">Celestial</span></div><strong class="gift-celestial__name">${escapeText(event.person.name)}</strong>${message(event.gift, "gift-celestial__gift")}</article>`;
  }

  function primordial(event) {
    return `<article class="receipt-item gift-primordial">${cardSparks("primordial")}<div class="gift-primordial__portrait"><span class="gift-primordial__aura" aria-hidden="true"></span><span class="gift-primordial__bloom" aria-hidden="true"></span><span class="gift-primordial__roots" aria-hidden="true"></span><span class="gift-primordial__pedestal" aria-hidden="true"></span><span class="gift-primordial__monolith" aria-hidden="true"></span><span class="gift-primordial__inlay" aria-hidden="true"></span><span class="gift-primordial__geode" aria-hidden="true"></span><span class="gift-primordial__vein gift-primordial__vein--fire" aria-hidden="true"></span><span class="gift-primordial__vein gift-primordial__vein--water" aria-hidden="true"></span><span class="gift-primordial__vein gift-primordial__vein--aether" aria-hidden="true"></span><span class="gift-primordial__vein gift-primordial__vein--light" aria-hidden="true"></span>${avatar(event.person, "gift-primordial__avatar")}<span class="gift-primordial__heartstone" aria-hidden="true"></span><span class="gift-primordial__shine" aria-hidden="true"></span><span class="gift-primordial__glint gift-primordial__glint--left" aria-hidden="true"></span><span class="gift-primordial__glint gift-primordial__glint--right" aria-hidden="true"></span><span class="gift-primordial__dust gift-primordial__dust--one" aria-hidden="true"></span><span class="gift-primordial__dust gift-primordial__dust--two" aria-hidden="true"></span><span class="gift-primordial__dust gift-primordial__dust--three" aria-hidden="true"></span><span class="gift-primordial__dust gift-primordial__dust--four" aria-hidden="true"></span><span class="gift-primordial__seal">Primordial</span></div><strong class="gift-primordial__name">${escapeText(event.person.name)}</strong>${message(event.gift, "gift-primordial__gift")}</article>`;
  }

  function cosmic(event) {
    return `<article class="receipt-item gift-cosmic">${cardSparks("cosmic")}<div class="gift-cosmic__portrait"><span class="gift-cosmic__galaxy" aria-hidden="true"></span><span class="gift-cosmic__orbit" aria-hidden="true"></span><span class="gift-cosmic__orbit gift-cosmic__orbit--inner" aria-hidden="true"></span>${avatar(event.person, "gift-cosmic__avatar")}<span class="gift-cosmic__nova" aria-hidden="true"></span><span class="gift-cosmic__comet" aria-hidden="true"></span><span class="gift-cosmic__star gift-cosmic__star--one" aria-hidden="true"></span><span class="gift-cosmic__star gift-cosmic__star--two" aria-hidden="true"></span><span class="gift-cosmic__star gift-cosmic__star--three" aria-hidden="true"></span><span class="gift-cosmic__seal">Cosmic</span></div><strong class="gift-cosmic__name">${escapeText(event.person.name)}</strong>${message(event.gift, "gift-cosmic__gift")}</article>`;
  }

  const renderers = { basic, featured: (event) => basic(event, true), stellar, epic, legendary, mythic, celestial, primordial, cosmic };

  function render(event) {
    if (event.type === "follow") {
      return `<article class="receipt-item follower"><span class="follower__mark" aria-hidden="true">+</span><strong class="follower__name">${escapeText(event.person.name)}</strong><span class="follower__message">New follower</span></article>`;
    }
    return (renderers[event.gift.tier] || renderers.basic)(event);
  }

  return { render, avatarImage, giftIconPlaceholder };
})();
