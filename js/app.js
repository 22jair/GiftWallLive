const { people, events } = window.GWL_DATA;
const podium = document.querySelector("#podium");
const feed = document.querySelector("#activity-feed");
const topGiftEvents = [];
let cursor = 0;

function nextEvent(updateScore = true) {
  const template = events[cursor % events.length];
  const type = template.type;
  const person = people[template.personIndex];
  const gift = template.gift;
  cursor += 1;
  const event = { id: cursor, type, person, gift };
  if (type === "gift") {
    if (updateScore) person.score += gift.points * gift.amount;
    topGiftEvents.push(event);
    if (topGiftEvents.length > 50) topGiftEvents.shift();
  }
  return event;
}

let initialCount = 0;
while (feed.scrollHeight < feed.parentElement.clientHeight && initialCount < 20) {
  window.GWLFeed.insert(feed, nextEvent(false), false);
  initialCount += 1;
}
window.GWLTopThree.render(podium, topGiftEvents);

window.setInterval(() => {
  const event = nextEvent(true);
  window.GWLFeed.insert(feed, event);
  if (event.type === "gift") window.GWLTopThree.render(podium, topGiftEvents);
}, 2200);
