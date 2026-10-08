window.GWLFeed = (() => {
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
