import { EventEmitter } from "node:events";
import { EventType, isStreakOver, TikTokLiveClient } from "piratetok-live-js";

export class PirateTokProvider extends EventEmitter {
  constructor(username) {
    super();
    this.username = username;
    this.client = new TikTokLiveClient(username)
      .timeout(15_000)
      .maxRetries(10)
      .staleTimeout(90_000)
      .heartbeatInterval(10_000);

    this.bindEvents();
  }

  bindEvents() {
    this.client.on(EventType.gift, (data) => {
      if (isStreakOver(data)) this.emit("liveEvent", { type: "gift", data });
    });
    this.client.on(EventType.follow, (data) => {
      this.emit("liveEvent", { type: "follow", data });
    });
    this.client.on(EventType.connected, (data = {}) => this.emit("connected", data));
    this.client.on(EventType.reconnecting, (data = {}) => this.emit("reconnecting", data));
    this.client.on(EventType.disconnected, () => this.emit("disconnected"));
    this.client.on(EventType.liveEnded, () => this.emit("liveEnded"));
    this.client.on("error", (error) => this.emit("providerError", error));
  }

  connect() {
    return this.client.connect();
  }

  disconnect() {
    return this.client.disconnect();
  }
}
