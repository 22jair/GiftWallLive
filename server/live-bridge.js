import http from "node:http";
import process from "node:process";
import { WebSocket, WebSocketServer } from "ws";
import { mapPirateTokEvent } from "./mappers/piratetok-mapper.js";
import { PirateTokProvider } from "./providers/piratetok-provider.js";

const username = (process.argv[2] || process.env.TIKTOK_USERNAME || "").replace(/^@/, "").trim();
const host = process.env.GIFTWALL_HOST || "127.0.0.1";
const port = Number.parseInt(process.env.GIFTWALL_PORT || "8081", 10);

if (!username) {
  console.error("Falta el username. Usa: npm start -- nombre_del_creador");
  process.exit(1);
}

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
  username: `@${username}`,
  roomId: null,
  updatedAt: new Date().toISOString(),
};

function setStatus(state, details = {}) {
  Object.assign(status, details, {
    type: "status",
    state,
    username: `@${username}`,
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

const httpServer = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Cache-Control", "no-store");

  if (request.method === "GET" && request.url === "/health") {
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ ...status, websocket: `ws://${host}:${port}/live` }));
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

websocketServer.on("connection", (client) => {
  client.send(JSON.stringify(status));
});

const provider = new PirateTokProvider(username);

provider.on("liveEvent", ({ type, data }) => {
  const event = mapPirateTokEvent({ type, data, sequence: ++sequence, roomId: status.roomId });
  broadcast(event);
  if (event.type === "gift") {
    console.log(
      `[gift] @${event.user.username} · ${event.gift.name} ×${event.gift.quantity} · ${event.gift.totalCoins} monedas`,
    );
  } else {
    console.log(`[follow] @${event.user.username}`);
  }
});

provider.on("connected", (data = {}) => {
  connecting = false;
  connected = true;
  retryAttempt = 0;
  setStatus("connected", { roomId: String(data.roomId || "") || null, error: null });
  console.log(`[tiktok] Conectado a @${username}${status.roomId ? ` · room ${status.roomId}` : ""}`);
});

provider.on("reconnecting", (data = {}) => {
  connected = false;
  setStatus("reconnecting", { error: data.error ? errorMessage(data.error) : null });
});

provider.on("disconnected", () => {
  connecting = false;
  connected = false;
  setStatus("disconnected");
  if (!stopping) scheduleReconnect();
});

provider.on("liveEnded", () => {
  connecting = false;
  connected = false;
  setStatus("offline");
  provider.disconnect();
  if (!stopping) scheduleReconnect();
});

provider.on("providerError", (error) => {
  const message = errorMessage(error);
  setStatus("error", { error: message });
  console.error(`[tiktok] ${message}`);
});

async function connect() {
  if (stopping || connecting || connected) return;
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

function scheduleReconnect() {
  if (stopping || retryTimer) return;
  const delay = Math.min(60_000, 5_000 * (2 ** Math.min(retryAttempt, 4)));
  retryAttempt += 1;
  setStatus("waiting", { retryInMs: delay });
  retryTimer = setTimeout(connect, delay);
}

async function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  clearTimeout(retryTimer);
  setStatus("stopping", { signal });
  console.log(`\n[server] Cerrando por ${signal}...`);

  try {
    provider.disconnect();
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
  connect();
});
