window.GWLFeed = (() => {
  function updateShowcase(event, animate) {
    const activeTier = event.type === "gift" ? event.gift.tier : "follow";
    let activeItem = null;
    document.querySelectorAll("[data-tier-card]").forEach((item) => {
      const isActive = item.dataset.tierCard === activeTier;
      item.classList.toggle("is-active", isActive);
      if (isActive) activeItem = item;
    });

    if (activeItem) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      activeItem.scrollIntoView({ behavior: animate && !reduceMotion ? "smooth" : "auto", block: "nearest", inline: "center" });
    }

    const label = document.querySelector("#active-tier-label");
    if (!label) return;
    if (event.type === "follow") {
      label.textContent = "Nuevo seguidor";
      return;
    }
    const activeName = activeItem?.querySelector("strong");
    label.textContent = activeName ? `${activeName.textContent} recibido` : "Regalo recibido";
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
    container.insertAdjacentHTML("afterbegin", window.GWLPrinterComponents.render(event));
    updateShowcase(event, animate);
    const fresh = container.firstElementChild;
    if (!animate) return;

    fresh.classList.add("receipt-item--printing");

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
