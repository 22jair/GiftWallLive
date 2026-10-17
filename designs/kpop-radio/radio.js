const params = new URLSearchParams(window.location.search);
const isDummy = params.get('source') === 'dummy';
const bubbleMarks = {
  BTS: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3 10 6v15l-7-3zm18 0-7 3v15l7-3z" fill="currentColor"/></svg>',
  BLACKPINK: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20c-3-2.8-9-7-9-12a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 5-6 9.2-9 12Z" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linejoin="round"/></svg>',
  TWICE: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5h13v3H10v12H6V8H2Z" fill="currentColor"/><path d="M14 11c-2 7 0 9 3 4 0 4 2 5 5 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  ENHYPEN: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h7M3 5v14h7M3 12h6m4 7V5l8 14V5" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
const groupNames = Object.keys(bubbleMarks);
const specialCards = {
  BTS: { image: '../../assets/images/kpop-bts-special-card-photo.png', alt: 'Los siete integrantes de BTS en un marco violeta con lightsticks y un regalo luminoso' },
  BLACKPINK: { image: '../../assets/images/kpop-blackpink-special-card.png', alt: 'Las cuatro integrantes de BLACKPINK en un marco rosa con corazones brillantes y un regalo' },
  TWICE: { image: '../../assets/images/kpop-twice-special-card.png', alt: 'Las nueve integrantes de TWICE en un marco dorado con destellos y un regalo' },
  ENHYPEN: { image: '../../assets/images/kpop-enhypen-special-card.png', alt: 'Los siete integrantes de ENHYPEN en un marco azul con estrellas y un regalo' },
};
const modeLabel = document.querySelector('#mode-label');
const largeReaction = document.querySelector('#large-reaction');
const largeReactionArt = document.querySelector('#large-reaction-art');
const largeAvatar = document.querySelector('#large-avatar');
const bubbleField = document.querySelector('#bubble-field');
const demoAvatar = '../../assets/images/kpop-demo-user-avatar.svg';
const specialDurationMs = 15000;
let largeTimer;
let bubbleIndex = 0;

largeAvatar.addEventListener('error', () => {
  if (largeAvatar.getAttribute('src') === demoAvatar) return;
  largeAvatar.src = demoAvatar;
  largeAvatar.alt = 'Avatar de muestra';
});

[[7, 5], [50, 0], [93, 7], [100, 28], [98, 68], [78, 93], [49, 100], [18, 94], [0, 72], [1, 36], [23, 18], [76, 45]].forEach(([x, y], index) => {
  const spark = document.createElement('span');
  spark.className = 'reaction-spark';
  spark.setAttribute('aria-hidden', 'true');
  spark.textContent = index % 3 === 0 ? '✧' : '✦';
  spark.style.setProperty('--spark-x', `${x}%`);
  spark.style.setProperty('--spark-y', `${y}%`);
  spark.style.setProperty('--spark-delay', `${index * 0.11}s`);
  largeReaction.append(spark);
});

function setGroup(group) {
  document.querySelectorAll('.group-chip').forEach((chip) => {
    chip.classList.toggle('is-active', chip.dataset.group === group);
  });
}

document.querySelectorAll('.group-chip').forEach((chip) => {
  const details = chip.querySelector('small');
  const group = chip.dataset.group;
  const premium = document.createElement('span');
  premium.className = 'premium-gift';
  premium.innerHTML = '<span class="coin-icon" aria-hidden="true">●</span>100<span class="gift-art" aria-label="Espacio para imagen del regalo especial">＋</span>';
  details.after(premium);
  chip.setAttribute('aria-label', `${group}, regalos de 30 y 100 monedas`);
});

function showLargeReaction(group = 'BTS', username = '@moonlight', coins = 100, avatarUrl = '') {
  const card = specialCards[group];
  if (!card || Number(coins) !== 100) return;
  window.clearTimeout(largeTimer);
  largeReaction.dataset.group = group;
  largeReactionArt.src = card.image;
  largeReactionArt.alt = card.alt;
  document.querySelector('#large-user').textContent = username;
  document.querySelector('#large-message').textContent = `¡Envió un regalo para ${group}!`;
  largeAvatar.src = avatarUrl || demoAvatar;
  largeAvatar.alt = avatarUrl ? `Foto de perfil de ${username}` : 'Avatar de muestra';
  largeReaction.setAttribute('aria-label', `${username} envió un regalo especial de 100 monedas para ${group}`);
  largeReaction.classList.remove('is-celebrating');
  largeReaction.hidden = false;
  void largeReaction.offsetWidth;
  largeReaction.classList.add('is-celebrating');
  largeTimer = window.setTimeout(() => {
    largeReaction.hidden = true;
    largeReaction.classList.remove('is-celebrating');
  }, specialDurationMs);
}

function spawnBubble(group = 'BTS', username = '@fan', avatarUrl = '') {
  if (!bubbleMarks[group]) return;
  if (bubbleField.childElementCount >= 20) bubbleField.firstElementChild.remove();
  const bubble = document.createElement('span');
  const x = 10 + Math.random() * 78;
  bubble.className = 'orbit-bubble';
  bubble.dataset.group = group;
  bubble.dataset.user = username;
  bubble.style.left = `${x}%`;
  bubble.style.setProperty('--flight', `${8.5 + Math.random() * 1.5}s`);
  bubble.style.setProperty('--drift-a', `${-18 + Math.random() * 36}px`);
  bubble.style.setProperty('--drift-b', `${-55 + Math.random() * 110}px`);
  bubble.style.setProperty('--drift-c', `${-80 + Math.random() * 160}px`);
  bubble.style.setProperty('--drift-d', `${-120 + Math.random() * 240}px`);
  const avatar = document.createElement('img');
  avatar.className = 'orbit-bubble__avatar';
  avatar.src = avatarUrl || demoAvatar;
  avatar.alt = '';
  avatar.addEventListener('error', () => {
    if (avatar.getAttribute('src') !== demoAvatar) avatar.src = demoAvatar;
  });
  const badge = document.createElement('span');
  badge.className = 'orbit-bubble__badge';
  badge.innerHTML = bubbleMarks[group];
  bubble.append(avatar, badge);
  bubbleField.append(bubble);
  bubble.addEventListener('animationend', () => bubble.remove(), { once: true });
}

function demoBubbles() {
  const names = ['@moonlight', '@starlit', '@pinkorbit', '@oncewave', '@engene'];
  for (let i = 0; i < 7; i += 1) {
    window.setTimeout(() => spawnBubble(groupNames[(bubbleIndex + i) % groupNames.length], names[(bubbleIndex + i) % names.length]), i * 420);
  }
  bubbleIndex += 1;
}

document.querySelectorAll('.group-chip').forEach((chip) => chip.addEventListener('click', () => setGroup(chip.dataset.group)));
document.querySelectorAll('.gift-item').forEach((gift) => gift.addEventListener('click', () => {
  if (gift.dataset.group) spawnBubble(gift.dataset.group, '@demo_user');
}));

window.addEventListener('kpop:gift', (event) => {
  const gift = event.detail || {};
  if (!specialCards[gift.group] || Number(gift.coins) !== 100) return;
  showLargeReaction(gift.group, gift.username, gift.coins, gift.avatarUrl);
});

window.addEventListener('kpop:bubble', (event) => {
  const gift = event.detail || {};
  if (!bubbleMarks[gift.group] || Number(gift.coins) !== 30) return;
  spawnBubble(gift.group, gift.username || '@fan', gift.avatarUrl);
});

if (isDummy) {
  document.querySelector('#dummy-tools').hidden = false;
  modeLabel.textContent = 'modo demo';
  document.querySelectorAll('[data-demo-group]').forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.dataset.demoGroup;
      setGroup(group);
      window.dispatchEvent(new CustomEvent('kpop:gift', { detail: { group, username: '@moonlight', coins: 100 } }));
    });
  });
  document.querySelector('[data-demo="bubble"]').addEventListener('click', demoBubbles);
  window.setTimeout(demoBubbles, 1100);
} else {
  modeLabel.textContent = 'en espera';
}

setGroup('BTS');
