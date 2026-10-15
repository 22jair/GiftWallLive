// Adaptador LIVE de la radio: consume eventos normalizados del puente local.
(() => {
  if (window.radioSource !== "live") return;
  if (!window.radioTickets || !window.radioQueue || !window.WebSocket) return;

  const params = new URLSearchParams(window.location.search);
  const socketUrl = params.get("socket") || "ws://127.0.0.1:8081/live";
  const liveQueue = [];
  const MAX_LIVE_QUEUE = 5;
  let socket = null;
  let retryTimer = null;
  let stopped = false;
  let musicActive = false;
  let currentTrackId = "";
  let reactionTimer = null;

  const username = (event) => event?.user?.username || event?.user?.displayName || "usuario";
  const avatar = (event) => event?.user?.avatarUrl || "../../assets/images/radio-mascot-wink.png";

  function returnToBaseReaction() {
    window.clearTimeout(reactionTimer);
    reactionTimer = window.setTimeout(() => {
      window.radioMascot?.[musicActive ? "listening" : "idle"]();
    }, 1800);
  }

  function reactToGift() {
    window.radioMascot?.happy();
    returnToBaseReaction();
  }

  function reactToFollow() {
    window.radioMascot?.greeting();
    returnToBaseReaction();
  }

  function reactToMusic(silent = false) {
    musicActive = true;
    window.radioMascot?.listening({ silent });
  }

  function renderQueue() {
    window.radioQueue.render(liveQueue.map((item) => ({
      user: item.user?.username || "usuario",
      request: `${item.track?.artist || item.artist || "Artista"} · ${item.track?.name || item.song || "Pedido musical"}`,
      avatar: item.user?.avatarUrl || "../../assets/images/radio-mascot-wink.png",
    })));
  }

  function addGift(event) {
    window.radioTickets.add({
      type: "gift",
      user: username(event),
      gift: event.gift?.name || "Regalo",
      quantity: event.gift?.quantity || 1,
      coins: event.gift?.totalCoins || 0,
      giftImage: event.gift?.imageUrl || "",
      avatar: avatar(event),
    });
    reactToGift();
  }

  function addJoin(event) {
    window.radioTickets.add({ type: "join", user: username(event), avatar: avatar(event) });
  }

  function addFollow(event) {
    window.radioTickets.add({ type: "follow", user: username(event), avatar: avatar(event) });
  }

  function addMusicRequest(item) {
    liveQueue.push(item);
    if (liveQueue.length > MAX_LIVE_QUEUE) liveQueue.shift();
    renderQueue();
    window.radioTickets.add({
      type: "music",
      user: item.user?.username || "usuario",
      song: item.track?.name || item.song || "Pedido musical",
      artist: item.track?.artist || item.artist || "",
      avatar: item.user?.avatarUrl || "../../assets/images/radio-mascot-wink.png",
    });
  }

  function updateNowPlaying(message) {
    const current = document.querySelector('.radio-current-request');
    if (!current || !message.track) return;
    const title = current.querySelector('.request-copy strong');
    const artist = current.querySelector('.request-copy small');
    const avatar = current.querySelector('.request-avatar');
    const changed = message.track.id && message.track.id !== currentTrackId;
    if (title) title.textContent = message.track.name || 'Canción actual';
    if (artist) artist.textContent = message.track.artist || 'Spotify';
    if (avatar && message.track.albumImageUrl) avatar.src = message.track.albumImageUrl;
    currentTrackId = message.track.id || currentTrackId;
    musicActive = Boolean(message.playing);
    if (changed) window.radioMascot?.listening({ silent: true });
    else if (!musicActive) window.radioMascot?.idle();
  }

  function scheduleReconnect() {
    if (stopped || retryTimer) return;
    retryTimer = window.setTimeout(() => {
      retryTimer = null;
      connect();
    }, 3000);
  }

  function connect() {
    if (stopped) return;
    socket = new WebSocket(socketUrl);
    socket.addEventListener("message", ({ data }) => {
      try {
        const message = JSON.parse(data);
        if (message.type === "gift") addGift(message);
        if (message.type === "follow") {
          reactToFollow();
          addFollow(message);
        }
        if (message.type === "join") addJoin(message);
        if (message.type === "spotify-fallback-started") reactToMusic(true);
        if (message.type === "spotify-now-playing") updateNowPlaying(message);
        if (message.type === "music-request-queued" && message.item) {
          reactToMusic();
          addMusicRequest(message.item);
        }
      } catch (error) {
        console.warn("[GiftWallLive] Evento de radio inválido", error);
      }
    });
    socket.addEventListener("close", scheduleReconnect);
    socket.addEventListener("error", () => socket.close());
  }

  window.addEventListener("beforeunload", () => {
    stopped = true;
    window.clearTimeout(retryTimer);
    socket?.close();
  }, { once: true });

  connect();
})();
