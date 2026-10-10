const { people, events } = window.GWL_DATA;
const podium = document.querySelector("#podium");
const feed = document.querySelector("#activity-feed");
const tierList = document.querySelector("#gift-tier-list");
const topGiftEvents = [];
let cursor = 0;
let eventSequence = 0;
let dummyTimer = null;
let source = "dummy";

window.GWLGiftTiers.renderShowcase(tierList);

function nextDummyEvent(updateScore = true) {
  const template = events[cursor % events.length];
  const type = template.type;
  const person = people[template.personIndex];
  const gift = template.gift ? {
    ...template.gift,
    tier: window.GWLGiftTiers.fromPoints(template.gift.points * template.gift.amount).id,
  } : undefined;
  cursor += 1;
  const event = { id: ++eventSequence, type, person, gift };
  if (type === "gift") {
    if (updateScore) person.score += gift.points * gift.amount;
  }
  return event;
}

function rememberGift(event) {
  if (event.type !== "gift") return;
  topGiftEvents.push(event);
  if (topGiftEvents.length > 50) topGiftEvents.shift();
}

function printEvent(event) {
  rememberGift(event);
  window.GWLFeed.insert(feed, event);
  if (event.type === "gift") window.GWLTopThree.render(podium, topGiftEvents);
}

function clearActivity() {
  feed.replaceChildren();
  topGiftEvents.length = 0;
  window.GWLTopThree.render(podium, topGiftEvents);
}

function fillWithDummyEvents() {
  let initialCount = 0;
  while (feed.scrollHeight < feed.parentElement.clientHeight && initialCount < 20) {
    const event = nextDummyEvent(false);
    rememberGift(event);
    window.GWLFeed.insert(feed, event, false);
    initialCount += 1;
  }
  window.GWLTopThree.render(podium, topGiftEvents);
}

function startDummyMode() {
  if (source === "dummy" && dummyTimer) return;
  source = "dummy";
  window.clearInterval(dummyTimer);
  clearActivity();
  fillWithDummyEvents();
  dummyTimer = window.setInterval(() => printEvent(nextDummyEvent(true)), 2200);
}

function startLiveMode() {
  if (source === "live") return;
  source = "live";
  window.clearInterval(dummyTimer);
  dummyTimer = null;
  clearActivity();
  document.querySelector("#active-tier-label").textContent = "LIVE connected";
}

function adaptLiveEvent(message) {
  const person = {
    name: `@${message.user.username}`,
    score: 0,
    initials: message.user.username.slice(0, 2).toUpperCase(),
    avatar: message.user.avatarUrl || "",
  };

  if (message.type === "follow") {
    return { id: ++eventSequence, sourceId: message.id, type: "follow", person };
  }

  const points = Number(message.gift.coinsEach) || 0;
  const amount = Number(message.gift.quantity) || 1;
  const totalPoints = Number(message.gift.totalCoins) || points * amount;
  return {
    id: ++eventSequence,
    sourceId: message.id,
    type: "gift",
    person,
    gift: {
      name: message.gift.name,
      amount,
      points,
      icon: message.gift.imageUrl || "",
      tier: window.GWLGiftTiers.fromPoints(totalPoints).id,
    },
  };
}

fillWithDummyEvents();
dummyTimer = window.setInterval(() => printEvent(nextDummyEvent(true)), 2200);

window.GWLLiveEvents.connect({
  onEvent(message) {
    if (source !== "live") startLiveMode();
    printEvent(adaptLiveEvent(message));
  },
  onAvailability(available) {
    if (available) startLiveMode();
    else if (source === "live") startDummyMode();
  },
});
