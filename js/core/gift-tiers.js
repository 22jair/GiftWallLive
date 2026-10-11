window.GWLGiftTiers = (() => {
  const follow = Object.freeze({ id: "follow", label: "New Follow", accent: "#e889b5" });
  const tiers = Object.freeze([
    Object.freeze({ id: "basic", label: "Basic", min: 1, max: 10, accent: "#a7adb7" }),
    Object.freeze({ id: "featured", label: "Featured", min: 11, max: 29, accent: "#e889b5" }),
    Object.freeze({ id: "stellar", label: "Stellar", min: 30, max: 50, accent: "#6ebbd1" }),
    Object.freeze({ id: "epic", label: "Epic", min: 51, max: 100, accent: "#9d70ed" }),
    Object.freeze({ id: "legendary", label: "Legendary", min: 101, max: 350, accent: "#dfb95d" }),
    Object.freeze({ id: "mythic", label: "Mythic", min: 351, max: 499, accent: "#79c7c1" }),
    Object.freeze({ id: "celestial", label: "Celestial", min: 500, max: 1500, accent: "#f19d73" }),
    Object.freeze({ id: "primordial", label: "Primordial", min: 1501, max: 4800, accent: "#86b39b" }),
    Object.freeze({ id: "cosmic", label: "Cosmic", min: 4801, max: Infinity, accent: "#7694ff" }),
  ]);

  function fromPoints(points) {
    const value = Number(points);
    return tiers.find((tier) => value >= tier.min && value <= tier.max) || tiers[0];
  }

  function rangeLabel(tier) {
    if (tier.id === "follow") return "No coins";
    if (tier.max === Infinity) return `${tier.min.toLocaleString("en-US")}+`;
    return `${tier.min.toLocaleString("en-US")}–${tier.max.toLocaleString("en-US")}`;
  }

  function compactRangeLabel(tier) {
    if (tier.id === "follow") return "—";
    if (tier.id === "celestial") return "500–1.5K";
    if (tier.id === "primordial") return "1.5K–4.8K";
    if (tier.id === "cosmic") return "4.8K+";
    return rangeLabel(tier);
  }

  function renderShowcase(container) {
    container.replaceChildren(...[follow, ...tiers].map((tier, index) => {
      const item = document.createElement("li");
      item.className = "gift-tier";
      item.dataset.tierCard = tier.id;
      item.style.setProperty("--tier-accent", tier.accent);
      item.title = `${tier.label}: ${rangeLabel(tier)}`;
      item.innerHTML = `<span class="gift-tier__number">${String(index).padStart(2, "0")}</span><span class="gift-tier__gem"></span><span class="gift-tier__copy"><strong>${tier.label}</strong><small><span class="gift-tier__range-full">${rangeLabel(tier)}</span><span class="gift-tier__range-compact">${compactRangeLabel(tier)}</span></small></span>`;
      return item;
    }));
  }

  return Object.freeze({ follow, tiers, fromPoints, rangeLabel, compactRangeLabel, renderShowcase });
})();
