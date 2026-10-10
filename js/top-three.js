window.GWLTopThree = (() => {
  const formatter = new Intl.NumberFormat("es-PE");
  const emptyLeaders = Array.from({ length: 3 }, (_, index) => ({
    id: `empty-${index + 1}`,
    empty: true,
    person: { name: "—", avatar: "" },
    gift: { name: "No gift", amount: 0, points: 0, icon: "" },
  }));

  function render(container, giftEvents) {
    const leaders = [...giftEvents]
      .sort((a, b) => (b.gift.points * b.gift.amount) - (a.gift.points * a.gift.amount) || b.id - a.id)
      .slice(0, 3);
    leaders.push(...emptyLeaders.slice(leaders.length));
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

      item.classList.toggle("leader--empty", event.empty === true);
      item.querySelector(".leader__emblem").textContent = ["♛", "✦", "◆"][index];
      item.querySelector(".leader__place").textContent = `Top ${index + 1}`;
      const avatar = item.querySelector(".leader__avatar img");
      avatar.src = window.GWLPrinterComponents.avatarImage(event.person);
      avatar.alt = event.empty ? `Empty Top ${index + 1} position` : `Photo of ${event.person.name}`;
      item.querySelector(".leader__name").textContent = event.person.name;
      item.querySelector(".leader__gift span").textContent = event.empty ? "—" : `Thanks for ×${event.gift.amount}`;
      const giftIcon = item.querySelector(".leader__gift img");
      giftIcon.src = event.gift.icon || window.GWLPrinterComponents.giftIconPlaceholder;
      giftIcon.alt = event.gift.name;
      giftIcon.hidden = event.empty === true;
      item.querySelector(".leader__total strong").textContent = formatter.format(event.gift.points * event.gift.amount);
      container.append(item);
      existing.delete(key);
    });

    existing.forEach((item) => item.remove());
  }

  return { render };
})();
