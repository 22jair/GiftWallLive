const params = new URLSearchParams(window.location.search);
const isDummy = params.get('source') === 'dummy';
const socketUrl = params.get('socket') || 'ws://127.0.0.1:8081/live';
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
const giftRail = document.querySelector('.gift-rail');
const recentGifts = document.querySelector('#recent-gifts');
const demoAvatar = '../../assets/images/kpop-demo-user-avatar.svg';
const giftImages = { bubble: '../../assets/images/gift-dona.webp', card: '../../assets/images/gift-corazon.webp' };
const reactionGiftIds = { '5879': 'bubble', '5660': 'card' };
const specialDurationMs = 15000;
const bubbleMinDurationMs = 15000;
const maxBubbles = 20;
const bubbleRadius = 19;
const bubbleCollisionDistance = 44;
const reduceBubbleMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const activeBubbles = [];
const bubbleQueue = [];
let largeTimer;
let bubbleIndex = 0;
let demoBubbleCount = 0;
let bubbleFrame = 0;
let lastBubbleFrame = 0;
let nextBubbleSwapAt = 0;

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
  const group = chip.dataset.group;
  chip.setAttribute('aria-label', `${group}, regalos recibidos`);
});

function incrementGroupCount(group, type) {
  const count = document.querySelector(`[data-group-count="${group}-${type}"]`);
  if (!count) return;
  count.textContent = String(Number(count.textContent || 0) + 1);
}

function showLargeReaction(group = 'BTS', username = '@moonlight', coins = 100, avatarUrl = '') {
  const card = specialCards[group];
  if (!card) return;
  incrementGroupCount(group, 'card');
  window.clearTimeout(largeTimer);
  largeReaction.dataset.group = group;
  largeReactionArt.src = card.image;
  largeReactionArt.alt = card.alt;
  document.querySelector('#large-user').textContent = username;
  largeAvatar.src = avatarUrl || demoAvatar;
  largeAvatar.alt = avatarUrl ? `Foto de perfil de ${username}` : 'Avatar de muestra';
  largeReaction.setAttribute('aria-label', `${username} envió un corazón para ${group}`);
  largeReaction.classList.remove('is-celebrating');
  largeReaction.hidden = false;
  void largeReaction.offsetWidth;
  largeReaction.classList.add('is-celebrating');
  largeTimer = window.setTimeout(() => {
    largeReaction.hidden = true;
    largeReaction.classList.remove('is-celebrating');
  }, specialDurationMs);
}

function bubbleBounds() {
  const width = bubbleField.clientWidth;
  const height = bubbleField.clientHeight;
  const minX = Math.min(34, width / 2);
  const minY = Math.min(34, height / 2);
  return { minX, maxX: Math.max(minX, width - 34), minY, maxY: Math.max(minY, height - 48) };
}

function railObstacle() {
  const field = bubbleField.getBoundingClientRect();
  const rail = giftRail.getBoundingClientRect();
  const gap = 4;
  return {
    left: rail.left - field.left - gap,
    right: rail.right - field.left + gap,
    top: rail.top - field.top - gap,
    bottom: rail.bottom - field.top + gap,
  };
}

function circleTouchesRail(x, y, rail) {
  const closestX = Math.max(rail.left, Math.min(rail.right, x));
  const closestY = Math.max(rail.top, Math.min(rail.bottom, y));
  return Math.hypot(x - closestX, y - closestY) < bubbleRadius;
}

function bounceOffRail(bubble, rail) {
  if (!circleTouchesRail(bubble.x, bubble.y, rail)) return;
  const closestX = Math.max(rail.left, Math.min(rail.right, bubble.x));
  const closestY = Math.max(rail.top, Math.min(rail.bottom, bubble.y));
  const dx = bubble.x - closestX;
  const dy = bubble.y - closestY;
  const distance = Math.hypot(dx, dy);
  let nx;
  let ny;
  if (distance) {
    nx = dx / distance;
    ny = dy / distance;
    bubble.x += nx * (bubbleRadius - distance);
    bubble.y += ny * (bubbleRadius - distance);
  } else {
    // Si el panel cambia de tamaño sobre una bolita, la sacamos hacia su lado libre.
    nx = -1;
    ny = 0;
    bubble.x = rail.left - bubbleRadius;
  }
  const towardRail = bubble.vx * nx + bubble.vy * ny;
  if (towardRail < 0) {
    bubble.vx -= 2 * towardRail * nx;
    bubble.vy -= 2 * towardRail * ny;
  }
}

function placeBubble(bubble) {
  bubble.element.style.transform = `translate3d(${bubble.x - bubbleRadius}px, ${bubble.y - bubbleRadius}px, 0)`;
  bubble.element.style.setProperty('--trail-angle', `${Math.atan2(bubble.vy, bubble.vx)}rad`);
}

function flashBubble(bubble, now) {
  if (reduceBubbleMotion.matches || now - (bubble.lastFlashAt ?? -Infinity) < 500) return;
  bubble.lastFlashAt = now;
  bubble.element.classList.remove('is-impact');
  void bubble.element.offsetWidth;
  bubble.element.classList.add('is-impact');
  window.setTimeout(() => bubble.element.classList.remove('is-impact'), 360);
}

function bubbleSpawnPoint(bounds, rail) {
  let point;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    point = {
      x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
      y: attempt === 0 ? bounds.maxY : bounds.minY + Math.random() * (bounds.maxY - bounds.minY),
    };
    if (!circleTouchesRail(point.x, point.y, rail) && activeBubbles.every((bubble) => Math.hypot(bubble.x - point.x, bubble.y - point.y) >= bubbleCollisionDistance + 8)) return point;
  }
  return { x: bounds.minX, y: bounds.maxY };
}

function createBubble({ group, username, avatarUrl }, now) {
  const bubble = document.createElement('span');
  bubble.className = 'orbit-bubble is-entering';
  bubble.dataset.group = group;
  bubble.dataset.user = username;
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
  const flash = document.createElement('span');
  flash.className = 'orbit-bubble__flash';
  flash.setAttribute('aria-hidden', 'true');
  bubble.append(avatar, badge, flash);
  bubbleField.append(bubble);
  const point = bubbleSpawnPoint(bubbleBounds(), railObstacle());
  const bubbleState = {
    element: bubble,
    x: point.x,
    y: point.y,
    vx: (Math.random() < .5 ? -1 : 1) * (42 + Math.random() * 30),
    vy: (Math.random() < .5 ? -1 : 1) * (18 + Math.random() * 28),
    enteredAt: now,
  };
  activeBubbles.push(bubbleState);
  placeBubble(bubbleState);
}

function fillBubbleSlots(now) {
  while (bubbleQueue.length) {
    if (activeBubbles.length >= maxBubbles) {
      const oldest = activeBubbles[0];
      if (oldest.leaving || now - oldest.enteredAt < bubbleMinDurationMs || now < nextBubbleSwapAt) break;
      oldest.leaving = true;
      oldest.element.classList.add('is-leaving');
      nextBubbleSwapAt = now + 650;
      window.setTimeout(() => {
        activeBubbles.shift();
        oldest.element.remove();
        fillBubbleSlots(performance.now());
      }, reduceBubbleMotion.matches ? 0 : 300);
      break;
    }
    createBubble(bubbleQueue.shift(), now);
  }
}

function moveBubbles(now) {
  const elapsed = lastBubbleFrame ? Math.min((now - lastBubbleFrame) / 1000, .05) : 0;
  lastBubbleFrame = now;
  fillBubbleSlots(now);
  const bounds = bubbleBounds();
  const rail = railObstacle();
  if (!reduceBubbleMotion.matches) {
    for (const bubble of activeBubbles) {
      if (bubble.leaving) continue;
      bubble.x += bubble.vx * elapsed;
      bubble.y += bubble.vy * elapsed;
      if (bubble.x <= bounds.minX || bubble.x >= bounds.maxX) { bubble.vx *= -1; flashBubble(bubble, now); }
      if (bubble.y <= bounds.minY || bubble.y >= bounds.maxY) { bubble.vy *= -1; flashBubble(bubble, now); }
      bubble.x = Math.max(bounds.minX, Math.min(bounds.maxX, bubble.x));
      bubble.y = Math.max(bounds.minY, Math.min(bounds.maxY, bubble.y));
    }
    for (let i = 0; i < activeBubbles.length; i += 1) {
      for (let j = i + 1; j < activeBubbles.length; j += 1) {
        const first = activeBubbles[i];
        const second = activeBubbles[j];
        if (first.leaving || second.leaving) continue;
        const dx = second.x - first.x;
        const dy = second.y - first.y;
        const distance = Math.hypot(dx, dy);
        if (distance >= bubbleCollisionDistance) continue;
        const nx = distance ? dx / distance : 1;
        const ny = distance ? dy / distance : 0;
        const overlap = (bubbleCollisionDistance - distance) / 2;
        first.x -= nx * overlap;
        first.y -= ny * overlap;
        second.x += nx * overlap;
        second.y += ny * overlap;
        const approachingSpeed = (second.vx - first.vx) * nx + (second.vy - first.vy) * ny;
        if (approachingSpeed < 0) {
          const impulse = -approachingSpeed * .94;
          first.vx -= impulse * nx;
          first.vy -= impulse * ny;
          second.vx += impulse * nx;
          second.vy += impulse * ny;
          flashBubble(first, now);
          flashBubble(second, now);
        }
      }
    }
  }
  for (const bubble of activeBubbles) {
    if (bubble.leaving) continue;
    bubble.x = Math.max(bounds.minX, Math.min(bounds.maxX, bubble.x));
    bubble.y = Math.max(bounds.minY, Math.min(bounds.maxY, bubble.y));
    if (circleTouchesRail(bubble.x, bubble.y, rail)) flashBubble(bubble, now);
    bounceOffRail(bubble, rail);
    placeBubble(bubble);
  }
  bubbleFrame = window.requestAnimationFrame(moveBubbles);
}

function spawnBubble(group = 'BTS', username = '@fan', avatarUrl = '') {
  if (!bubbleMarks[group]) return;
  incrementGroupCount(group, 'bubble');
  bubbleQueue.push({ group, username, avatarUrl });
  fillBubbleSlots(performance.now());
  if (!bubbleFrame) bubbleFrame = window.requestAnimationFrame(moveBubbles);
}

function demoBubbles() {
  const names = ['@moonlight', '@starlit', '@pinkorbit', '@oncewave', '@engene'];
  for (let i = 0; i < 7; i += 1) {
    window.setTimeout(() => spawnBubble(groupNames[(bubbleIndex + i) % groupNames.length], names[(bubbleIndex + i) % names.length]), i * 420);
  }
  bubbleIndex += 1;
}

document.querySelectorAll('.group-chip').forEach((chip) => chip.addEventListener('click', () => setGroup(chip.dataset.group)));

function safeImage(url, fallback) {
  return typeof url === 'string' && /^(https?:\/\/|\.\.\/\.\.\/assets\/images\/)/i.test(url) ? url : fallback;
}

function addRecentGift(event) {
  const gift = event.gift || {};
  const username = `@${String(event.user?.username || 'usuario').replace(/^@/, '')}`;
  const row = document.createElement('div');
  row.className = 'recent-gift';
  const avatar = document.createElement('img');
  avatar.className = 'recent-gift__avatar';
  avatar.src = safeImage(event.user?.avatarUrl, demoAvatar);
  avatar.alt = '';
  avatar.onerror = () => { avatar.onerror = null; avatar.src = demoAvatar; };
  const details = document.createElement('span');
  details.className = 'recent-gift__details';
  const name = document.createElement('b');
  name.textContent = username;
  const description = document.createElement('small');
  description.textContent = `${gift.name || 'Regalo'} · ${Number(gift.totalCoins) || 0} monedas`;
  details.append(name, description);
  const image = document.createElement('img');
  image.className = 'recent-gift__image';
  const kind = giftKind(gift);
  image.src = safeImage(gift.imageUrl, giftImages[kind] || '');
  image.alt = gift.name || 'Regalo';
  image.onerror = () => {
    if (kind && image.src !== new URL(giftImages[kind], document.baseURI).href) {
      image.onerror = null;
      image.src = giftImages[kind];
    } else {
      const placeholder = document.createElement('span');
      placeholder.className = 'recent-gift__image';
      placeholder.textContent = '🎁';
      placeholder.setAttribute('aria-label', gift.name || 'Regalo');
      image.replaceWith(placeholder);
    }
  };
  row.append(avatar, details, image);
  recentGifts.prepend(row);
  while (recentGifts.childElementCount > 5) recentGifts.lastElementChild.remove();
}

function normalizeText(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function giftKind(gift = {}) {
  const kindById = reactionGiftIds[String(gift.id || '')];
  if (kindById) return kindById;
  const normalized = normalizeText(gift.name);
  if (normalized === 'doughnut') return 'bubble';
  if (normalized === 'hand heart') return 'card';
  return null;
}

function requestedGroup(text) {
  const match = normalizeText(text).match(/^love\s+(bts|blackpink|bp|twice|tw|enhypen|en)\s*[!.]?$/);
  return { bts: 'BTS', blackpink: 'BLACKPINK', bp: 'BLACKPINK', twice: 'TWICE', tw: 'TWICE', enhypen: 'ENHYPEN', en: 'ENHYPEN' }[match?.[1]] || null;
}

function liveTestCommand(text) {
  const match = normalizeText(text).match(/^(dona|cora)_(b|bp|tw|en)$/);
  if (!match) return null;
  return {
    kind: match[1] === 'dona' ? 'bubble' : 'card',
    group: { b: 'BTS', bp: 'BLACKPINK', tw: 'TWICE', en: 'ENHYPEN' }[match[2]],
  };
}

const pendingReactions = new Map();
const seenGifts = new Set();
function onLiveGift(event) {
  if (event.id && seenGifts.has(event.id)) return;
  if (event.id) {
    seenGifts.add(event.id);
    if (seenGifts.size > 500) seenGifts.delete(seenGifts.values().next().value);
  }
  addRecentGift(event);
  const kind = giftKind(event.gift);
  const userId = String(event.user?.id || event.user?.username || '');
  if (!kind || !userId) return;
  const queue = pendingReactions.get(userId) || [];
  queue.push({ kind, expiresAt: Date.now() + 60000, user: event.user });
  pendingReactions.set(userId, queue);
}

function onLiveChat(event) {
  const test = liveTestCommand(event.chat?.text);
  if (test) {
    const username = `@${String(event.user?.username || 'fan').replace(/^@/, '')}`;
    if (test.kind === 'bubble') spawnBubble(test.group, username, event.user?.avatarUrl);
    else showLargeReaction(test.group, username, 100, event.user?.avatarUrl);
    return;
  }
  const group = requestedGroup(event.chat?.text);
  const userId = String(event.user?.id || event.user?.username || '');
  if (!group || !userId) return;
  const queue = (pendingReactions.get(userId) || []).filter((item) => item.expiresAt > Date.now());
  const next = queue.shift();
  if (queue.length) pendingReactions.set(userId, queue);
  else pendingReactions.delete(userId);
  if (!next) return;
  const username = `@${String(next.user.username || 'fan').replace(/^@/, '')}`;
  if (next.kind === 'bubble') spawnBubble(group, username, next.user.avatarUrl);
  else showLargeReaction(group, username, 100, next.user.avatarUrl);
}

function formatTime(milliseconds) {
  const seconds = Math.max(0, Math.floor(Number(milliseconds || 0) / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function onSpotifyPlayback(message) {
  if (!message.track) return;
  const track = message.track;
  document.querySelector('#song-title').textContent = track.name || 'Esperando música';
  document.querySelector('#song-artist').textContent = track.artist || 'Spotify';
  const duration = Number(track.durationMs) || 0;
  const elapsed = Math.min(Number(message.progressMs) || 0, duration || Infinity);
  document.querySelector('#elapsed').textContent = formatTime(elapsed);
  document.querySelector('#duration').textContent = formatTime(duration);
  const progress = duration ? Math.round(elapsed / duration * 100) : 0;
  document.querySelector('#progress').style.width = `${progress}%`;
  document.querySelector('.progress-line').setAttribute('aria-valuenow', String(progress));
  const album = document.querySelector('.album-art');
  if (track.albumImageUrl) {
    album.style.backgroundImage = `url("${encodeURI(track.albumImageUrl).replace(/"/g, '%22')}")`;
    album.classList.add('has-cover');
  }
}

function connectLive() {
  const socket = new WebSocket(socketUrl);
  socket.addEventListener('open', () => { modeLabel.textContent = 'en vivo'; });
  socket.addEventListener('message', ({ data }) => {
    try {
      const event = JSON.parse(data);
      if (event.type === 'gift') onLiveGift(event);
      else if (event.type === 'chat') onLiveChat(event);
      else if (event.type === 'spotify-now-playing') onSpotifyPlayback(event);
      else if (event.type === 'status') modeLabel.textContent = event.state === 'connected' ? 'en vivo' : 'conectando';
    } catch (error) { console.warn('[K-pop radio] Evento inválido', error); }
  });
  socket.addEventListener('close', () => {
    modeLabel.textContent = 'reconectando';
    window.setTimeout(connectLive, 3000);
  });
  socket.addEventListener('error', () => socket.close());
}

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
  document.querySelectorAll('[data-demo-bubble-group]').forEach((button) => {
    button.addEventListener('click', () => {
      demoBubbleCount += 1;
      const group = button.dataset.demoBubbleGroup;
      setGroup(group);
      window.dispatchEvent(new CustomEvent('kpop:bubble', {
        detail: { group, coins: 30, username: `@prueba${demoBubbleCount}` },
      }));
    });
  });
  window.setTimeout(demoBubbles, 1100);
} else {
  modeLabel.textContent = 'conectando';
  connectLive();
}

setGroup('BTS');
