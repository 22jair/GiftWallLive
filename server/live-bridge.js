import http from "node:http";
import { readFileSync } from "node:fs";
import process from "node:process";
import { WebSocket, WebSocketServer } from "ws";
import { createSpotifyIntegration, loadSpotifyConfig } from "./spotify/integration.js";
import { MusicRequestService } from "./spotify/requests.js";
import { SpotifyFallbackRadio } from "./spotify/fallback.js";
import { mapPirateTokEvent } from "./mappers/piratetok-mapper.js";
import { PirateTokProvider } from "./providers/piratetok-provider.js";

// El usuario se elige desde el panel; el argumento CLI mantiene compatibilidad.
let username = (process.argv[2] || "").replace(/^@/, "").trim();
const host = process.env.GIFTWALL_HOST || "127.0.0.1";
const port = Number.parseInt(process.env.GIFTWALL_PORT || "8081", 10);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error("GIFTWALL_PORT debe ser un puerto válido.");
  process.exit(1);
}

let sequence = 0;
let retryTimer = null;
let retryAttempt = 0;
let stopping = false;
let connecting = false;
let connected = false;

const status = {
  type: "status",
  state: "starting",
  username: username ? `@${username}` : "",
  roomId: null,
  updatedAt: new Date().toISOString(),
};

const spotify = createSpotifyIntegration(loadSpotifyConfig());
const musicRequests = new MusicRequestService({ spotifyClient: spotify.client });
const fallbackRadio = new SpotifyFallbackRadio({
  spotifyClient: spotify.client,
  hasPendingRequests: () => Boolean(musicRequests.queue.peek()),
});

// Mantiene sincronizada la tarjeta de música con lo que esté sonando en Spotify.
let lastPlayingId = "";
const syncSpotifyPlayback = async () => {
  if (!spotify.client.isAuthenticated()) return;
  try {
    const playback = await spotify.client.getPlaybackState();
    const track = playback?.item;
    if (!track?.id) return;
    lastPlayingId = track.id;
    broadcast({ version: 1, type: "spotify-now-playing", playing: Boolean(playback.is_playing), track: {
      id: track.id,
      name: track.name,
      artist: track.artists?.map((artist) => artist.name).join(", ") || "",
      albumImageUrl: track.album?.images?.[0]?.url || "",
    } });
  } catch (error) {
    if (error?.status !== 204) console.error(`[spotify] Estado no disponible: ${error.message || error}`);
  }
};
setInterval(syncSpotifyPlayback, 5000);

function setStatus(state, details = {}) {
  Object.assign(status, details, {
    type: "status",
    state,
    username: username ? `@${username}` : "",
    updatedAt: new Date().toISOString(),
  });
  broadcast(status);
}

function errorMessage(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error?.message) return String(error.message);
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

const httpServer = http.createServer(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Cache-Control", "no-store");

  if (await spotify.handleHttpRequest(request, response)) return;

  if (request.method === "GET" && request.url === "/") {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(readFileSync(new URL('./panel.html', import.meta.url), 'utf8'));
    return;
  }

  if (request.method === "POST" && ["/tiktok/connect", "/tiktok/stop"].includes(request.url)) {
    try {
    let body = "";
    for await (const chunk of request) body += chunk;
    const input = body ? JSON.parse(body) : {};
    if (request.url === "/tiktok/stop") await stopTikTok();
    else await connectTikTok(input.username);
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify(status));
    } catch (error) {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: errorMessage(error) }));
    }
    return;
  }

  if (request.method === "GET" && request.url === "/health") {
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({
      ...status,
      spotify: spotify.client.status(),
      websocket: `ws://${host}:${port}/live`,
    }));
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify({ error: "Not found", health: "/health", websocket: "/live" }));
});

const websocketServer = new WebSocketServer({ server: httpServer, path: "/live" });

function broadcast(payload) {
  const message = JSON.stringify(payload);
  websocketServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(message);
  });
}

musicRequests.on("window-opened", (pending) => {
  broadcast({ version: 1, type: "music-request-window", pending });
});
musicRequests.on("window-expired", (pending) => {
  broadcast({ version: 1, type: "music-request-window-expired", pending });
});
musicRequests.on("queued", (item) => {
  broadcast({ version: 1, type: "music-request-queued", item });
});
musicRequests.on("request-rejected", (result) => {
  broadcast({ version: 1, type: "music-request-rejected", ...result });
});
musicRequests.on("spotify-error", (error) => {
  console.error(`[spotify] ${error.message || error}`);
});
fallbackRadio.on("started", (track) => {
  broadcast({ version: 1, type: "spotify-fallback-started", track });
  console.log(`[spotify] Radio automática: ${track.name} · ${track.artist}`);
});
fallbackRadio.on("error", (error) => {
  if (error?.status !== 404) console.error(`[spotify] Radio automática: ${error.message || error}`);
});

websocketServer.on("connection", (client) => {
  client.send(JSON.stringify(status));
});

let provider = null;

function bindProvider(instance) {
instance.on("liveEvent", ({ type, data }) => {
  const event = mapPirateTokEvent({ type, data, sequence: ++sequence, roomId: status.roomId });
  broadcast(event);
  if (event.type === "gift") musicRequests.registerGift(event);
  if (event.type === "chat") void musicRequests.handleChat(event);
  if (event.type === "gift") {
    console.log(
      `[gift] @${event.user.username} · ${event.gift.name} ×${event.gift.quantity} · ${event.gift.totalCoins} monedas`,
    );
  } else if (event.type === "follow") {
    console.log(`[follow] @${event.user.username}`);
  } else if (event.type === "chat") {
    console.log(`[chat] @${event.user.username}: ${event.chat.text}`);
  } else {
    console.log(`[join] @${event.user.username}`);
  }
});

instance.on("connected", (data = {}) => {
  connecting = false;
  connected = true;
  retryAttempt = 0;
  setStatus("connected", { roomId: String(data.roomId || "") || null, error: null });
  console.log(`[tiktok] Conectado a @${username}${status.roomId ? ` · room ${status.roomId}` : ""}`);
});

instance.on("reconnecting", (data = {}) => {
  connected = false;
  setStatus("reconnecting", { error: data.error ? errorMessage(data.error) : null });
});

instance.on("disconnected", () => {
  connecting = false;
  connected = false;
  setStatus("disconnected");
  if (!stopping) scheduleReconnect();
});

instance.on("liveEnded", () => {
  connecting = false;
  connected = false;
  setStatus("offline");
  instance.disconnect();
  if (!stopping) scheduleReconnect();
});

instance.on("providerError", (error) => {
  const message = errorMessage(error);
  setStatus("error", { error: message });
  console.error(`[tiktok] ${message}`);
});
}

async function connect() {
  if (stopping || connecting || connected || !provider) return;
  clearTimeout(retryTimer);
  retryTimer = null;
  connecting = true;
  setStatus("connecting");

  try {
    const roomId = await provider.connect();
    connecting = false;
    connected = true;
    retryAttempt = 0;
    setStatus("connected", { roomId: String(roomId || "") || null, error: null });
  } catch (error) {
    connecting = false;
    connected = false;
    const message = errorMessage(error);
    setStatus("offline", { error: message });
    console.error(`[tiktok] No se pudo conectar a @${username}: ${message}`);
    scheduleReconnect();
  }
}

async function connectTikTok(value) {
  const nextUsername = String(value || "").replace(/^@/, "").trim();
  if (!nextUsername) throw new Error("Falta el usuario de TikTok");
  if (provider) await stopTikTok();
  username = nextUsername;
  provider = new PirateTokProvider(username);
  bindProvider(provider);
  stopping = false;
  await connect();
}

async function stopTikTok() {
  clearTimeout(retryTimer);
  retryTimer = null;
  stopping = true;
  connected = false;
  connecting = false;
  const previous = provider;
  provider = null;
  previous?.removeAllListeners();
  try { await previous?.disconnect(); } catch (error) { console.warn(errorMessage(error)); }
  setStatus("offline", { roomId: null });
}

function scheduleReconnect() {
  if (stopping || retryTimer) return;
  const delay = Math.min(60_000, 5_000 * (2 ** Math.min(retryAttempt, 4)));
  retryAttempt += 1;
  setStatus("waiting", { retryInMs: delay });
  retryTimer = setTimeout(connect, delay);
}

async function shutdown(signal) {
  stopping = true;
  clearTimeout(retryTimer);
  setStatus("stopping", { signal });
  console.log(`\n[server] Cerrando por ${signal}...`);

  try {
    provider?.disconnect();
  } catch {}

  websocketServer.clients.forEach((client) => client.close(1001, "Server shutting down"));
  websocketServer.close();
  httpServer.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 2_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

httpServer.listen(port, host, () => {
  console.log(`[server] Estado: http://${host}:${port}/health`);
  console.log(`[server] Eventos: ws://${host}:${port}/live`);
  if (username) {
    provider = new PirateTokProvider(username);
    bindProvider(provider);
    connect();
  } else {
    setStatus("offline");
    console.log(`[server] Abre http://${host}:${port} para conectar TikTok`);
  }
  fallbackRadio.start();
});
