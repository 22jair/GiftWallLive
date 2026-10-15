export const MUSIC_PRIORITY = Object.freeze({
  normal: 1,
  priority: 2,
});

export function classifyGiftCoins(value) {
  const coins = Number(value);
  if (!Number.isFinite(coins) || coins < 50) return null;
  if (coins >= 400) return "priority";
  return "normal";
}

export class MusicRequestQueue {
  constructor({ maxItems = 100 } = {}) {
    this.maxItems = maxItems;
    this.items = [];
    this.sequence = 0;
  }

  enqueue({ request, track }) {
    const priority = request.priority || classifyGiftCoins(request.coins);
    if (!priority) throw new Error("La solicitud no tiene una prioridad válida.");

    const item = Object.freeze({
      id: request.id,
      sequence: ++this.sequence,
      queuedAt: new Date().toISOString(),
      priority,
      priorityRank: MUSIC_PRIORITY[priority],
      coins: Number(request.coins),
      user: request.user,
      song: request.song,
      artist: request.artist,
      track,
    });

    this.items.push(item);
    this.items.sort((left, right) => right.priorityRank - left.priorityRank || left.sequence - right.sequence);
    if (this.items.length > this.maxItems) this.items.length = this.maxItems;
    return item;
  }

  peek() {
    return this.items[0] || null;
  }

  shift() {
    return this.items.shift() || null;
  }

  snapshot() {
    return this.items.slice();
  }
}

const PLAY_COMMAND = /^play(?:\s*:\s*|\s+)/iu;
const HOST_PLAY_COMMAND = /^(play_[np])\s+(.+)$/iu;
const MAX_FIELD_LENGTH = 120;

function cleanField(value) {
  return String(value || "")
    .trim()
    .replace(/^["“”']+|["“”']+$/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function splitRequest(body) {
  const pipe = body.indexOf("|");
  if (pipe >= 0) return [body.slice(0, pipe), body.slice(pipe + 1)];

  const quotedDash = body.match(/^["“](.+?)["”]\s+-\s+["“](.+?)["”]$/u);
  if (quotedDash) return [quotedDash[1], quotedDash[2]];

  const dash = body.lastIndexOf(" - ");
  if (dash >= 0) return [body.slice(0, dash), body.slice(dash + 3)];
  return [body, ""];
}

export function parsePlayCommand(content) {
  if (typeof content !== "string") return null;
  const match = content.match(PLAY_COMMAND);
  if (!match) return null;

  const parts = splitRequest(content.slice(match[0].length).trim());
  if (!parts) return null;
  const song = cleanField(parts[0]);
  const artist = cleanField(parts[1]);
  if (!song || song.length > MAX_FIELD_LENGTH || artist.length > MAX_FIELD_LENGTH) return null;

  return {
    song,
    artist,
    query: [song, artist].filter(Boolean).join(" "),
  };
}

export function parseHostPlayCommand(content) {
  if (typeof content !== "string") return null;
  const match = content.trim().match(HOST_PLAY_COMMAND);
  if (!match) return null;
  const parsed = parsePlayCommand(`play: ${match[2]}`);
  if (!parsed) return null;
  return { ...parsed, priority: match[1].toLowerCase() === "play_p" ? "priority" : "normal" };
}

import { EventEmitter } from "node:events";

export class MusicRequestService extends EventEmitter {
  constructor({ spotifyClient, windowMs = 60_000, queue = new MusicRequestQueue() } = {}) {
    super();
    this.spotifyClient = spotifyClient;
    this.windowMs = windowMs;
    this.queue = queue;
    this.pendingByUser = new Map();
  }

  registerGift(event) {
    const priority = classifyGiftCoins(event?.gift?.totalCoins);
    const userId = String(event?.user?.id || "").trim();
    if (!priority || !userId) return null;

    const pending = Object.freeze({
      id: `music-window:${event.id}`,
      user: event.user,
      coins: Number(event.gift.totalCoins),
      priority,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + this.windowMs,
    });
    this.pendingByUser.set(userId, pending);
    this.emit("window-opened", pending);
    return pending;
  }

  pendingSnapshot() {
    this.pruneExpired();
    return [...this.pendingByUser.values()];
  }

  pruneExpired(now = Date.now()) {
    for (const [userId, pending] of this.pendingByUser) {
      if (pending.expiresAt <= now) {
        this.pendingByUser.delete(userId);
        this.emit("window-expired", pending);
      }
    }
  }

  async handleChat(event) {
    this.pruneExpired();
    const parsed = parsePlayCommand(event?.chat?.text || event?.message?.text || "");
    const userId = String(event?.user?.id || "").trim();
    if (!parsed || !userId) return { status: "ignored" };

    const pending = this.pendingByUser.get(userId);
    if (!pending) {
      const result = { status: "rejected", code: "no-active-window", user: event.user, parsed };
      this.emit("request-rejected", result);
      return result;
    }
    this.pendingByUser.delete(userId);

    if (!this.spotifyClient?.isAuthenticated()) {
      const result = { status: "rejected", code: "spotify-not-connected", user: event.user, parsed };
      this.emit("request-rejected", result);
      return result;
    }

    try {
      const track = await this.spotifyClient.searchTrack(parsed);
      if (!track) {
        const result = { status: "rejected", code: "track-not-found", user: event.user, parsed };
        this.emit("request-rejected", result);
        return result;
      }

      const item = this.queue.enqueue({
        request: {
          id: `music-request:${event.id}`,
          user: event.user,
          coins: pending.coins,
          priority: pending.priority,
          song: track.name || parsed.song,
          artist: track.artist || parsed.artist,
        },
        track,
      });
      this.emit("queued", item);
      return { status: "queued", item };
    } catch (error) {
      this.emit("spotify-error", error);
      return { status: "error", code: "spotify-api-error", error };
    }
  }

  async handleHostChat(event) {
    const parsed = parseHostPlayCommand(event?.chat?.text || "");
    if (!parsed) return { status: "ignored" };
    if (!this.spotifyClient?.isAuthenticated()) return { status: "rejected", code: "spotify-not-connected", parsed };
    try {
      const track = await this.spotifyClient.searchTrack(parsed);
      if (!track) return { status: "rejected", code: "track-not-found", parsed };
      const item = this.queue.enqueue({
        request: {
          id: `host-music-request:${event.id}`,
          user: event.user,
          coins: parsed.priority === "priority" ? 400 : 100,
          priority: parsed.priority,
          song: track.name || parsed.song,
          artist: track.artist || parsed.artist,
        },
        track,
      });
      this.emit("queued", item);
      return { status: "queued", item };
    } catch (error) {
      this.emit("spotify-error", error);
      return { status: "error", code: "spotify-api-error", error };
    }
  }

  snapshot() {
    return {
      pending: this.pendingSnapshot(),
      queue: this.queue.snapshot(),
    };
  }
}
