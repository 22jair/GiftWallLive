const { people, gifts, sequence } = window.GWL_DATA;
const podium = document.querySelector("#podium");
const feed = document.querySelector("#activity-feed");
let cursor = 0;

function nextEvent(updateScore = true) {
  const type = sequence[cursor % sequence.length];
  const person = people[cursor % people.length];
  const gift = gifts[cursor % gifts.length];
  cursor += 1;
  if (type === "gift" && updateScore) person.score += gift.points;
  return { type, person, gift };
}

let initialCount = 0;
while (feed.scrollHeight < feed.parentElement.clientHeight && initialCount < 20) {
  window.GWLFeed.insert(feed, nextEvent(false), false);
  initialCount += 1;
}
window.GWLTopThree.render(podium, people);

window.setInterval(() => {
  const event = nextEvent(true);
  window.GWLFeed.insert(feed, event);
  if (event.type === "gift") window.GWLTopThree.render(podium, people);
}, 2200);
