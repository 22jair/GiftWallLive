window.GWLFeed = (() => {
  const formatter = new Intl.NumberFormat("es-PE");

  function giftTier(points) {
    if (points < 30) return { className: "standard", label: "Regalo" };
    if (points < 100) return { className: "featured", label: "Regalo destacado" };
    if (points < 1000) return { className: "stellar", label: "Regalo estelar" };
    if (points < 3000) return { className: "epic", label: "Regalo épico" };
    if (points < 5000) return { className: "legendary", label: "Regalo legendario" };
    if (points < 10000) return { className: "mythic", label: "Regalo mítico" };
    return { className: "ultimate", label: "Regalo máximo" };
  }

  function markup(event, animate) {
    const printingClass = animate ? " receipt-item--printing" : "";
    if (event.type === "follow") {
      return `<article class="receipt-item receipt-item--follow${printingClass}"><p class="receipt-item__name">${event.person.name}</p><p class="receipt-item__message">Nuevo seguidor</p></article>`;
    }
    const tier = giftTier(event.gift.points);
    return `<article class="receipt-item receipt-item--gift receipt-item--${tier.className}${printingClass}"><span class="receipt-item__avatar" style="--avatar:${event.person.avatar}" aria-hidden="true">${event.person.initials}</span><div class="receipt-item__content"><p class="receipt-item__tier">${tier.label}</p><h3 class="receipt-item__name">${event.person.name}</h3><p class="receipt-item__message">Envió ${event.gift.name} ×${event.gift.amount}</p><p class="receipt-item__total">${formatter.format(event.gift.points)} puntos · Acumulado: ${formatter.format(event.person.score)}</p></div></article>`;
  }

  function trimToReceipt(container) {
    const availableHeight = container.parentElement.clientHeight;
    while (container.children.length > 1) {
      const last = container.lastElementChild;
      const remainingHeight = container.scrollHeight - last.getBoundingClientRect().height;
      if (remainingHeight < availableHeight) break;
      last.remove();
    }
  }

  function insert(container, event, animate = true) {
    const previous = new Map([...container.children].map((item) => [item, item.getBoundingClientRect().top]));
    container.insertAdjacentHTML("afterbegin", markup(event, animate));
    const fresh = container.firstElementChild;
    if (!animate) return;

    fresh.addEventListener("animationend", () => {
      fresh.classList.remove("receipt-item--printing");
      trimToReceipt(container);
    }, { once: true });
    requestAnimationFrame(() => {
      [...container.children].slice(1).forEach((item) => {
        const oldTop = previous.get(item);
        if (oldTop === undefined) return;
        item.animate([{ transform: `translateY(${oldTop - item.getBoundingClientRect().top}px)` }, { transform: "translateY(0)" }], { duration: 700, easing: "cubic-bezier(.2,.8,.2,1)" });
      });
    });
  }
  return { insert };
})();
