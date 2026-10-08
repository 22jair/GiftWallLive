const participants = [
  { name: "@jhonatan27", score: 1420, initials: "J", avatar: "linear-gradient(145deg, #1d6a83, #19304c 55%, #0f1627)" },
  { name: "@laura.diaz", score: 850, initials: "L", avatar: "linear-gradient(145deg, #ef91c9, #763e91 55%, #272344)" },
  { name: "@maritza", score: 720, initials: "M", avatar: "linear-gradient(145deg, #e89a77, #7d3553 55%, #251b38)" },
  { name: "@oscar", score: 410, initials: "O", avatar: "linear-gradient(145deg, #96a9bf, #273f56 60%, #17202f)" },
  { name: "@kevin027", score: 380, initials: "K", avatar: "linear-gradient(145deg, #3c88a5, #1e4257 55%, #10182c)" },
  { name: "@andrea", score: 345, initials: "A", avatar: "linear-gradient(145deg, #ff9a7b, #8e315b 55%, #301a3b)" },
  { name: "@carlos", score: 290, initials: "C", avatar: "linear-gradient(145deg, #edc777, #80523a 55%, #303251)" },
  { name: "@josep.r", score: 255, initials: "JR", avatar: "linear-gradient(145deg, #7f75c7, #34315f 55%, #181830)" },
  { name: "@valentina", score: 190, initials: "V", avatar: "linear-gradient(145deg, #ff91a9, #a84271 55%, #402047)" },
  { name: "@diego.live", score: 145, initials: "D", avatar: "linear-gradient(145deg, #69c5a0, #286457 55%, #17302f)" },
];

const giftCatalog = [
  { gift: "Rosa", icon: "🌹", value: 1 },
  { gift: "TikTok", icon: "♪", value: 5 },
  { gift: "Perfume", icon: "💝", value: 20 },
  { gift: "Helado", icon: "🍦", value: 10 },
  { gift: "GG", icon: "🌈", value: 35 },
  { gift: "Corazón", icon: "💖", value: 50 },
  { gift: "Estrella", icon: "⭐", value: 75 },
  { gift: "Corona", icon: "👑", value: 100 },
];

const placeColors = ["#ffc95c", "#6ed7ff", "#ff9870"];
const quantities = [1, 1, 3, 1, 5, 2, 1, 10];
const numberFormat = new Intl.NumberFormat("es-PE");
const timeFormat = new Intl.DateTimeFormat("es-PE", { hour: "numeric", minute: "2-digit" });
const podium = document.querySelector("#podium");
const giftFeed = document.querySelector("#gift-feed");
const giftWall = document.querySelector(".gift-wall");

let participantCursor = 2;
let giftCursor = 0;

function avatarMarkup(person) {
  return `<span class="avatar" style="--avatar-background:${person.avatar}" aria-hidden="true">${person.initials}</span>`;
}

function winnerCard(winner, index) {
  const place = index + 1;
  return `
    <article class="winner-card" data-user="${winner.name}" data-place="${place}" style="--winner-color:${placeColors[index]}">
      <span class="winner-card__place" aria-label="Puesto ${place}">${place}</span>
      ${avatarMarkup(winner)}
      <p class="winner-card__name" title="${winner.name}">${winner.name}</p>
      <p class="winner-card__score"><span class="coin" aria-hidden="true">◆</span>${numberFormat.format(winner.score)}</p>
    </article>
  `;
}

function giftCard(event, isPrinting = false) {
  const celebrationClass = event.isSuper ? " gift-card--super" : event.isGolden ? " gift-card--gold" : "";
  const celebrationBadge = event.isSuper
    ? '<span class="gift-card__mega-badge">🔥 REGALO SÚPER 🔥</span>'
    : event.isGolden
      ? '<span class="gift-card__mega-badge">✦ REGALO GRANDE ✦</span>'
      : "";

  return `
    <article class="gift-card${isPrinting ? " gift-card--printing" : ""}${celebrationClass}">
      ${celebrationBadge}
      ${avatarMarkup(event)}
      <div class="gift-card__copy">
        <h3 class="gift-card__name" title="${event.name}">${event.name}</h3>
        <p class="gift-card__action">Envió <strong>${event.gift} x${event.amount}</strong></p>
        <p class="gift-card__thanks">Acumulado: ${numberFormat.format(event.total)} ♡</p>
      </div>
      <div class="gift-card__icon" aria-label="${event.gift}">
        ${event.icon}
        <time class="gift-card__time">${event.time}</time>
      </div>
    </article>
  `;
}

function renderPodium() {
  const leaders = [...participants].sort((a, b) => b.score - a.score).slice(0, 3);
  const currentCards = [...podium.children];

  if (currentCards.length === 0) {
    podium.innerHTML = leaders.map(winnerCard).join("");
    return;
  }

  const previousPositions = new Map(
    currentCards.map((card) => [card, card.getBoundingClientRect()]),
  );
  const cardsByUser = new Map(currentCards.map((card) => [card.dataset.user, card]));
  const leaderNames = new Set(leaders.map((leader) => leader.name));

  currentCards.forEach((card) => {
    if (!leaderNames.has(card.dataset.user)) card.remove();
  });

  leaders.forEach((leader, index) => {
    const place = index + 1;
    let card = cardsByUser.get(leader.name);

    if (!card) {
      const template = document.createElement("template");
      template.innerHTML = winnerCard(leader, index).trim();
      card = template.content.firstElementChild;
    } else {
      const score = card.querySelector(".winner-card__score");
      const nextScore = numberFormat.format(leader.score);

      if (!score.textContent.includes(nextScore)) {
        score.innerHTML = `<span class="coin" aria-hidden="true">◆</span>${nextScore}`;
        score.animate([
          { transform: "scale(1)", color: "#fff8d1" },
          { transform: "scale(1.14)", color: "#ffe56f" },
          { transform: "scale(1)", color: "#fff8d1" },
        ], { duration: 420, easing: "ease-out" });
      }
    }

    card.dataset.place = place;
    card.style.setProperty("--winner-color", placeColors[index]);
    card.querySelector(".winner-card__place").textContent = place;
    card.querySelector(".winner-card__place").setAttribute("aria-label", `Puesto ${place}`);
    podium.append(card);
  });

  window.requestAnimationFrame(() => {
    [...podium.children].forEach((card) => {
      const previous = previousPositions.get(card);
      if (!previous) return;

      const current = card.getBoundingClientRect();
      const deltaX = previous.left - current.left;
      const deltaY = previous.top - current.top;
      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

      card.animate([
        { transform: `translate(${deltaX}px, ${deltaY}px)` },
        { transform: "translate(0, 0)" },
      ], { duration: 650, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
  });
}

function createGiftEvent(updateScore = true) {
  const participant = participants[participantCursor % participants.length];
  const gift = giftCatalog[giftCursor % giftCatalog.length];
  const amount = quantities[giftCursor % quantities.length];

  if (updateScore) {
    participant.score += gift.value * amount;
  }

  participantCursor += 1;
  giftCursor += 1;

  return {
    ...participant,
    ...gift,
    amount,
    total: participant.score,
    time: timeFormat.format(new Date()),
    isGolden: gift.value * amount >= 100 && gift.value * amount < 500,
    isSuper: gift.value * amount >= 500,
  };
}

function waveShape(index) {
  const wave = [0, 4, -3, 5, -5, 3, -2, 2];
  const rotation = [0, 0.35, -0.28, 0.42, -0.38, 0.25, -0.18, 0.12];
  const scale = [1, 0.99, 0.975, 0.985, 0.965, 0.98, 0.96, 0.95];

  return {
    x: wave[index % wave.length],
    rotation: rotation[index % rotation.length],
    scale: scale[index % scale.length],
  };
}

function applyWaveShape() {
  [...giftFeed.children].forEach((card, index) => {
    const shape = waveShape(index);
    card.style.setProperty("--wave-x", `${shape.x}px`);
    card.style.setProperty("--wave-rotate", `${shape.rotation}deg`);
    card.style.setProperty("--wave-scale", shape.scale);
  });
}

function printGift() {
  const previousPositions = new Map(
    [...giftFeed.children].map((card) => [card, card.getBoundingClientRect().top]),
  );
  const event = createGiftEvent();
  giftWall.classList.remove("gift-wall--printing");
  void giftWall.offsetWidth;
  giftWall.classList.add("gift-wall--printing");
  giftFeed.insertAdjacentHTML("afterbegin", giftCard(event, true));
  const printedCard = giftFeed.firstElementChild;

  applyWaveShape();

  window.requestAnimationFrame(() => {
    [...giftFeed.children].slice(1).forEach((card, index) => {
      const previousTop = previousPositions.get(card);
      if (previousTop === undefined) return;

      const deltaY = previousTop - card.getBoundingClientRect().top;
      const shape = waveShape(index + 1);
      const finalTransform = `translateX(${shape.x}px) rotate(${shape.rotation}deg) scaleX(${shape.scale})`;

      card.animate([
        { transform: `translateY(${deltaY}px) ${finalTransform}` },
        { transform: finalTransform },
      ], {
        duration: 900,
        easing: "cubic-bezier(.2,.75,.25,1)",
      });
    });
  });

  printedCard.addEventListener("animationend", () => {
    printedCard.classList.remove("gift-card--printing");
    giftWall.classList.remove("gift-wall--printing");
  }, { once: true });

  if (giftFeed.children.length > 3) {
    const leavingCard = giftFeed.lastElementChild;
    const exitAnimation = leavingCard.animate([
      { opacity: 1, filter: "blur(0)", transform: leavingCard.style.transform },
      { opacity: 0, filter: "blur(3px)", transform: "translateY(3rem) scaleX(.88)" },
    ], {
      duration: 850,
      easing: "ease-in",
      fill: "forwards",
    });
    exitAnimation.finished.then(() => leavingCard.remove());
  }

  renderPodium();
}

const superDonor = participants.find((participant) => participant.name === "@diego.live");
superDonor.score += 1000;

const superDemo = {
  ...superDonor,
  gift: "Corona",
  icon: "👑",
  value: 100,
  amount: 10,
  total: superDonor.score,
  time: timeFormat.format(new Date()),
  isGolden: false,
  isSuper: true,
};

const initialEvents = [
  createGiftEvent(false),
  superDemo,
  createGiftEvent(false),
];

renderPodium();
giftFeed.innerHTML = initialEvents.map((event) => giftCard(event)).join("");
applyWaveShape();

window.setInterval(printGift, 2600);
