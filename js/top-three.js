window.GWLTopThree = (() => {
  const formatter = new Intl.NumberFormat("es-PE");

  function render(container, giftEvents) {
    const leaders = [...giftEvents]
      .sort((a, b) => (b.gift.points * b.gift.amount) - (a.gift.points * a.gift.amount) || b.id - a.id)
      .slice(0, 3);
    const existing = new Map([...container.children].map((item) => [item.dataset.event, item]));

    leaders.forEach((event, index) => {
      const key = String(event.id);
      let item = existing.get(key);
      if (!item) {
        item = document.createElement("article");
        item.className = "leader";
        item.dataset.event = key;
        item.innerHTML = '<span class="leader__emblem" aria-hidden="true"></span><span class="leader__place"></span><div class="leader__avatar"><img></div><p class="leader__name"></p><p class="leader__gift"><span></span><img data-tiktok-gift-icon></p><p class="leader__total"><span aria-hidden="true">◆</span><strong></strong></p>';
      }

      item.querySelector(".leader__emblem").textContent = ["♛", "✦", "◆"][index];
      item.querySelector(".leader__place").textContent = `Top ${index + 1}`;
      const avatar = item.querySelector(".leader__avatar img");
      avatar.src = window.GWLPrinterComponents.avatarImage(event.person);
      avatar.alt = `Foto de ${event.person.name}`;
      item.querySelector(".leader__name").textContent = event.person.name;
      item.querySelector(".leader__gift span").textContent = `Thanks for ×${event.gift.amount}`;
      const giftIcon = item.querySelector(".leader__gift img");
      giftIcon.src = event.gift.icon || window.GWLPrinterComponents.giftIconPlaceholder;
      giftIcon.alt = event.gift.name;
      item.querySelector(".leader__total strong").textContent = formatter.format(event.gift.points * event.gift.amount);
      container.append(item);
      existing.delete(key);
    });

    existing.forEach((item) => item.remove());
  }

  return { render };
})();
