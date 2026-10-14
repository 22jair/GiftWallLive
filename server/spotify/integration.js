import crypto from "node:crypto";

function createPkcePair() {
  const verifier = crypto.randomBytes(64).toString("base64url");
  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");
  return { verifier, challenge };
}

function createState() {
  return crypto.randomBytes(32).toString("base64url");
}

const DEFAULT_SCOPES = [
  "user-read-playback-state",
  "user-read-currently-playing",
  "user-modify-playback-state",
];

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseScopes(value) {
  if (!value) return DEFAULT_SCOPES;
  const scopes = String(value)
    .split(/[\s,]+/u)
    .map((scope) => scope.trim())
    .filter(Boolean);
  return scopes.length > 0 ? scopes : DEFAULT_SCOPES;
}

export function loadSpotifyConfig(env = process.env) {
  const clientId = String(env.SPOTIFY_CLIENT_ID || "").trim();
  const redirectUri = String(
    env.SPOTIFY_REDIRECT_URI || "http://127.0.0.1:8081/spotify/callback",
  ).trim();

  return Object.freeze({
    enabled: Boolean(clientId),
    clientId,
    redirectUri,
    scopes: Object.freeze(parseScopes(env.SPOTIFY_SCOPES)),
    accountsBase: String(env.SPOTIFY_ACCOUNTS_BASE || "https://accounts.spotify.com").replace(/\/$/u, ""),
    apiBase: String(env.SPOTIFY_API_BASE || "https://api.spotify.com/v1").replace(/\/$/u, ""),
    requestWindowMs: positiveInteger(env.SPOTIFY_REQUEST_WINDOW_MS, 60_000),
    authAttemptTtlMs: positiveInteger(env.SPOTIFY_AUTH_ATTEMPT_TTL_MS, 10 * 60_000),
  });
}

import { SpotifyClient, SpotifyApiError } from "./client.js";

function json(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function html(response, status, title, message) {
  response.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  response.end(`<!doctype html><meta charset="utf-8"><title>${title}</title><p>${message}</p>`);
}

export function createSpotifyIntegration(config) {
  const client = new SpotifyClient(config);
  let authAttempt = null;

  function authorizationUrl() {
    if (!config.enabled) throw new SpotifyApiError("Falta SPOTIFY_CLIENT_ID.", { status: 503 });
    const pkce = createPkcePair();
    const state = createState();
    authAttempt = { state, verifier: pkce.verifier, createdAt: Date.now() };

    const params = new URLSearchParams({
      client_id: config.clientId,
      response_type: "code",
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(" "),
      code_challenge_method: "S256",
      code_challenge: pkce.challenge,
      state,
    });
    return `${config.accountsBase}/authorize?${params}`;
  }

  async function callback(url) {
    const query = new URL(url, config.redirectUri).searchParams;
    if (query.get("error")) throw new SpotifyApiError(`Spotify canceló la autorización: ${query.get("error")}.`, { status: 400 });
    if (!authAttempt || Date.now() - authAttempt.createdAt > config.authAttemptTtlMs) {
      throw new SpotifyApiError("La autorización de Spotify expiró. Vuelve a iniciar sesión.", { status: 400 });
    }
    if (query.get("state") !== authAttempt.state) {
      throw new SpotifyApiError("El estado OAuth de Spotify no coincide.", { status: 400 });
    }
    const code = query.get("code");
    if (!code) throw new SpotifyApiError("Spotify no devolvió un código.", { status: 400 });

    const attempt = authAttempt;
    authAttempt = null;
    return client.exchangeCode({ code, verifier: attempt.verifier });
  }

  async function handleHttpRequest(request, response) {
    const url = new URL(request.url || "/", `http://${request.headers.host || "127.0.0.1"}`);
    if (!url.pathname.startsWith("/spotify/")) return false;

    try {
      if (request.method === "GET" && url.pathname === "/spotify/login") {
        response.writeHead(302, { Location: authorizationUrl() });
        response.end();
        return true;
      }
      if (request.method === "GET" && url.pathname === "/spotify/callback") {
        await callback(url.href);
        html(response, 200, "Spotify conectado", "Spotify quedó conectado. Ya puedes cerrar esta pestaña.");
        return true;
      }
      if (request.method === "GET" && url.pathname === "/spotify/status") {
        json(response, 200, client.status());
        return true;
      }
      if (request.method === "GET" && url.pathname === "/spotify/player") {
        json(response, 200, await client.getPlaybackState());
        return true;
      }
      if (request.method === "GET" && url.pathname === "/spotify/queue") {
        json(response, 200, await client.getQueue());
        return true;
      }
      json(response, 404, { error: "Spotify route not found" });
      return true;
    } catch (error) {
      const status = error instanceof SpotifyApiError && error.status >= 400 ? error.status : 500;
      json(response, status, { error: error.message || "Spotify request failed" });
      return true;
    }
  }

  return Object.freeze({ client, handleHttpRequest, authorizationUrl });
}
