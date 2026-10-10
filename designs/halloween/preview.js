// Reuses demo events and classification; never opens a socket or changes LIVE data.
(() => {
  const tiers = [GWLGiftTiers.follow, ...GWLGiftTiers.tiers];
  const collection = document.querySelector("#card-collection");
  for (const tier of tiers) {
    const source = GWL_DATA.events.find(event => tier.id === "follow"
      ? event.type === "follow"
      : event.type === "gift" && GWLGiftTiers.fromPoints(event.gift.points * event.gift.amount).id === tier.id);
    const event = { ...source, person: GWL_DATA.people[source.personIndex] };
    if (source.gift) event.gift = { ...source.gift, tier: tier.id };
    const section = document.createElement("section");
    section.className = "collection-specimen";
    section.dataset.tier = tier.id;
    section.innerHTML = '<header class="specimen-heading"><h2>' + tier.label + '</h2><span>' +
      GWLGiftTiers.rangeLabel(tier) + '</span></header><div class="specimen-stage"></div>' +
      '<button class="specimen-replay" type="button" aria-label="Replay ' + tier.label + ' arrival">Replay arrival</button>';
    const stage = section.querySelector(".specimen-stage");
    const replay = () => {
      stage.innerHTML = GWLPrinterComponents.render(event);
      stage.firstElementChild.classList.add("receipt-item--printing");
      stage.firstElementChild.addEventListener("animationend", function end(animation) {
        if (animation.target !== this || animation.animationName !== "print-row") return;
        this.classList.remove("receipt-item--printing");
        this.removeEventListener("animationend", end);
      });
    };
    stage.innerHTML = GWLPrinterComponents.render(event);
    section.querySelector("button").addEventListener("click", replay);
    collection.append(section);
  }
  document.querySelector("#motion-toggle").addEventListener("click", function () {
    const paused = document.body.classList.toggle("motion-paused");
    this.setAttribute("aria-pressed", String(paused));
    this.textContent = paused ? "Resume motion" : "Pause motion";
  });
})();
